const { validationResult } = require('express-validator');
const { User, AuditLog, SystemSetting, Employee, Department, Sequelize } = require('../models');
const ResponseHelper = require('../utils/responseHelper');

const { Op } = Sequelize;

function splitName(name) {
  const parts = String(name || '').trim().split(/\s+/);
  return {
    firstName: parts[0] || 'User',
    lastName: parts.slice(1).join(' ') || parts[0] || 'User',
  };
}

function normalizeRole(role) {
  if (role === 'user') return 'operator';
  if (['admin', 'manager', 'operator', 'viewer'].includes(role)) return role;
  return 'operator';
}

async function listUsers(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return ResponseHelper.validationError(res, errors.array());

  const {
    companyId,
    role,
    isActive,
    search,
    page = 1,
    limit = 100,
  } = req.query;

  const where = {};
  if (companyId) where.companyId = parseInt(companyId, 10);
  if (role) where.role = role;
  if (isActive !== undefined && isActive !== '') {
    where.isActive = isActive === 'true' || isActive === true;
  }
  if (search) {
    where[Op.or] = [
      { username: { [Op.like]: `%${search}%` } },
      { email: { [Op.like]: `%${search}%` } },
      { firstName: { [Op.like]: `%${search}%` } },
      { lastName: { [Op.like]: `%${search}%` } },
    ];
  }

  const lim = Math.min(parseInt(limit, 10) || 100, 200);
  const off = (Math.max(parseInt(page, 10) || 1, 1) - 1) * lim;

  const rows = await User.findAll({
    where,
    attributes: { exclude: ['passwordHash'] },
    include: [
      {
        model: Employee,
        as: 'employee',
        // Use a minimal attribute set because some installations have partial employee schema
        attributes: ['id', 'userId', 'departmentId', 'employeeCode', 'firstName', 'lastName', 'email', 'isActive'],
        required: false,
        include: [
          {
            model: Department,
            as: 'department',
            attributes: ['name'],
            required: false,
          },
        ],
      },
    ],
    limit: lim,
    offset: off,
    // Keep ordering on physical column name to avoid alias mismatch on some MySQL setups
    order: [['created_at', 'DESC']],
  });

  const data = rows.map((u) => {
    const j = u.toJSON();
    const department = j.employee?.department?.name || '—';
    return {
      ...j,
      name: `${j.firstName || ''} ${j.lastName || ''}`.trim(),
      department,
      status: j.isActive ? 'active' : 'inactive',
    };
  });

  return ResponseHelper.success(res, data, 'Users retrieved successfully');
}

async function createUser(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return ResponseHelper.validationError(res, errors.array());

  let {
    username,
    email,
    password,
    firstName,
    lastName,
    role,
    companyId,
    name,
    status,
  } = req.body;

  if (name && (!firstName || !lastName)) {
    const s = splitName(name);
    firstName = firstName || s.firstName;
    lastName = lastName || s.lastName;
  }

  if (!firstName || !lastName) {
    return ResponseHelper.badRequest(res, 'Provide firstName and lastName, or a full name field');
  }

  if (!username && email) {
    username = String(email).split('@')[0].replace(/[^a-z0-9_]/gi, '') + Math.floor(Math.random() * 1000);
  }
  if (!password) password = 'ChangeMe123!';
  companyId = companyId != null ? parseInt(companyId, 10) : req.user.companyId;
  role = normalizeRole(role);
  const isActive = status !== 'inactive';

  const exists = await User.findOne({
    where: { [Op.or]: [{ email }, { username }] },
  });
  if (exists) {
    return ResponseHelper.conflict(res, 'User with this email or username already exists');
  }

  const user = await User.create({
    username,
    email,
    passwordHash: password,
    firstName,
    lastName,
    role,
    companyId,
    isActive,
  });

  return ResponseHelper.created(
    res,
    {
      ...user.toJSON(),
      name: `${user.firstName} ${user.lastName}`.trim(),
      department: '—',
      status: user.isActive ? 'active' : 'inactive',
    },
    'User created successfully'
  );
}

async function updateUser(req, res) {
  const v = validationResult(req);
  if (!v.isEmpty()) return ResponseHelper.validationError(res, v.array());

  const id = parseInt(req.params.id, 10);
  const user = await User.findByPk(id);
  if (!user) return ResponseHelper.notFound(res, 'User not found');

  let {
    email,
    firstName,
    lastName,
    role,
    name,
    department,
    status,
    password,
  } = req.body;

  if (name) {
    const s = splitName(name);
    firstName = firstName || s.firstName;
    lastName = lastName || s.lastName;
  }

  const updates = {};
  if (email) updates.email = email;
  if (firstName) updates.firstName = firstName;
  if (lastName) updates.lastName = lastName;
  if (role) updates.role = normalizeRole(role);
  if (status !== undefined) updates.isActive = status === 'active';
  if (password && String(password).length >= 6) updates.passwordHash = password;

  await user.update(updates);
  await user.reload();
  const j = user.toJSON();
  delete j.passwordHash;
  return ResponseHelper.success(
    res,
    {
      ...j,
      name: `${user.firstName} ${user.lastName}`.trim(),
      department: department || '—',
      status: user.isActive ? 'active' : 'inactive',
    },
    'User updated successfully'
  );
}

async function deleteUser(req, res) {
  const id = parseInt(req.params.id, 10);
  if (id === req.user.id) {
    return ResponseHelper.badRequest(res, 'Cannot delete your own account');
  }
  const user = await User.findByPk(id);
  if (!user) return ResponseHelper.notFound(res, 'User not found');
  await user.destroy();
  return ResponseHelper.success(res, { id }, 'User deleted successfully');
}

async function toggleUserStatus(req, res) {
  const id = parseInt(req.params.id, 10);
  const user = await User.findByPk(id);
  if (!user) return ResponseHelper.notFound(res, 'User not found');
  await user.update({ isActive: !user.isActive });
  await user.reload();
  const j = user.toJSON();
  delete j.passwordHash;
  return ResponseHelper.success(
    res,
    {
      ...j,
      name: `${user.firstName} ${user.lastName}`.trim(),
      status: user.isActive ? 'active' : 'inactive',
    },
    'User status updated'
  );
}

async function listSettings(req, res) {
  const rows = await SystemSetting.findAll({
    where: { companyId: req.user.companyId },
    order: [['setting_key', 'ASC']],
  });
  const settings = rows.map((r) => ({
    id: r.id,
    name: r.settingKey,
    value: r.settingValue,
    description: r.description,
  }));
  const categories = [
    {
      category: 'Application',
      settings,
    },
  ];
  return ResponseHelper.success(res, categories, 'System settings retrieved successfully');
}

async function updateSettingById(req, res) {
  const id = parseInt(req.params.id, 10);
  const { settingValue, value } = req.body;
  const nextVal = settingValue != null ? settingValue : value;
  if (nextVal === undefined) {
    return ResponseHelper.badRequest(res, 'settingValue or value is required');
  }
  const row = await SystemSetting.findOne({
    where: { id, companyId: req.user.companyId },
  });
  if (!row) return ResponseHelper.notFound(res, 'Setting not found');
  await row.update({
    settingValue: String(nextVal),
    updatedBy: req.user.id,
  });
  return ResponseHelper.success(res, row.toJSON(), 'Setting updated');
}

async function listAuditLogs(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return ResponseHelper.validationError(res, errors.array());

  const lim = Math.min(parseInt(req.query.limit, 10) || 100, 200);
  const rows = await AuditLog.findAll({
    where: { companyId: req.user.companyId },
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'firstName', 'lastName', 'email'],
        required: false,
      },
    ],
    order: [['createdAt', 'DESC']],
    limit: lim,
  });

  const data = rows.map((log) => {
    const j = log.toJSON();
    const u = j.user;
    const userLabel = u
      ? `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.email
      : 'System';
    let status = 'success';
    if (j.action && String(j.action).includes('FAIL')) status = 'failed';
    return {
      id: j.id,
      user: userLabel,
      action: j.action,
      module: j.tableName || '—',
      timestamp: j.createdAt,
      ip: j.ipAddress || '—',
      status,
    };
  });

  return ResponseHelper.success(res, data, 'Audit logs retrieved successfully');
}

async function createAuditLog(req, res) {
  const log = await AuditLog.create({
    companyId: req.user.companyId,
    userId: req.user.id,
    action: req.body.action || 'ADMIN_ACTION',
    tableName: req.body.module || 'administration',
    recordId: req.body.recordId || null,
    newValues: req.body,
    ipAddress: req.body.ip || req.ip,
    userAgent: req.get('user-agent'),
  });
  return ResponseHelper.created(res, { id: log.id }, 'Audit log created');
}

module.exports = {
  listUsers,
  createUser,
  updateUser,
  deleteUser,
  toggleUserStatus,
  listSettings,
  updateSettingById,
  listAuditLogs,
  createAuditLog,
};
