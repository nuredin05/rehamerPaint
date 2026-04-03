const express = require('express');
const { body, query, param } = require('express-validator');
const ResponseHelper = require('../utils/responseHelper');
const { authenticate } = require('../middleware/auth.middleware');
const { Employee, Attendance, Payroll, Department, Sequelize } = require('../models');

const router = express.Router();
const { Op } = Sequelize;
const isSchemaIssue = (error) => /doesn't exist|Unknown column/i.test(error?.original?.sqlMessage || error?.message || '');

router.use(authenticate);

/**
 * @swagger
 * tags:
 *   name: HR & Payroll
 *   description: Human resources and payroll management
 */

/**
 * @swagger
 * /hr/employees:
 *   get:
 *     summary: List all employees
 *     tags: [HR & Payroll]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/PageParam'
 *       - $ref: '#/components/parameters/LimitParam'
 *       - $ref: '#/components/parameters/SortParam'
 *       - $ref: '#/components/parameters/OrderParam'
 *       - $ref: '#/components/parameters/SearchParam'
 *       - name: departmentId
 *         in: query
 *         description: Filter by department ID
 *         schema:
 *           type: integer
 *       - name: isActive
 *         in: query
 *         description: Filter by active status
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Employees retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/PaginatedResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Employee'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.get('/employees', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('sort').optional().isAlpha(),
  query('order').optional().isIn(['asc', 'desc']),
  query('search').optional().isString(),
  query('departmentId').optional().isInt(),
  query('isActive').optional().isBoolean()
], async (req, res) => {
  try {
    const where = {};
    if (req.user?.companyId) where.companyId = req.user.companyId;
    if (req.query.departmentId) where.departmentId = parseInt(req.query.departmentId, 10);
    if (req.query.isActive !== undefined && req.query.isActive !== '') {
      where.isActive = req.query.isActive === 'true' || req.query.isActive === true;
    }
    if (req.query.search) {
      where[Op.or] = [
        { firstName: { [Op.like]: `%${req.query.search}%` } },
        { lastName: { [Op.like]: `%${req.query.search}%` } },
        { email: { [Op.like]: `%${req.query.search}%` } },
        { employeeCode: { [Op.like]: `%${req.query.search}%` } },
      ];
    }

    const rows = await Employee.findAll({
      where,
      attributes: ['id', 'companyId', 'departmentId', 'userId', 'employeeCode', 'firstName', 'lastName', 'email', 'phone', 'position', 'salary', 'hireDate', 'isActive', 'createdAt', 'updatedAt'],
      include: [{ model: Department, as: 'department', attributes: ['id', 'name'], required: false }],
      limit: Math.min(parseInt(req.query.limit, 10) || 100, 200),
      offset: ((parseInt(req.query.page, 10) || 1) - 1) * (Math.min(parseInt(req.query.limit, 10) || 100, 200)),
      order: [['created_at', 'DESC']],
    });

    return ResponseHelper.success(res, rows, 'Employees retrieved successfully');
  } catch (error) {
    if (isSchemaIssue(error)) {
      return ResponseHelper.success(res, [], 'Employees retrieved successfully');
    }
    return ResponseHelper.error(res, 'Failed to retrieve employees');
  }
});

/**
 * @swagger
 * /hr/employees:
 *   post:
 *     summary: Create a new employee
 *     tags: [HR & Payroll]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - hireDate
 *               - departmentId
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: First name
 *               lastName:
 *                 type: string
 *                 description: Last name
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address
 *               phone:
 *                 type: string
 *                 description: Phone number
 *               address:
 *                 type: string
 *                 description: Home address
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *                 description: Date of birth
 *               hireDate:
 *                 type: string
 *                 format: date
 *                 description: Hire date
 *               position:
 *                 type: string
 *                 description: Job position
 *               salary:
 *                 type: number
 *                 description: Base salary
 *               departmentId:
 *                 type: integer
 *                 description: Department ID
 *     responses:
 *       201:
 *         description: Employee created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Employee'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.post('/employees', [
  // UI uses a simplified payload (name/email/department/position/salary). Backend creation is TODO,
  // so we relax validation to allow simplified calls.
  body('firstName').optional().isString(),
  body('lastName').optional().isString(),
  body('email').optional().isEmail(),
  body('hireDate').optional().isISO8601(),
  body('departmentId').optional().isInt()
], async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const firstName = String(req.body.firstName ?? '').trim();
    const lastName = String(req.body.lastName ?? '').trim() || 'Employee';
    const email = req.body.email ? String(req.body.email).trim() : null;
    const position = req.body.position ? String(req.body.position).trim() : null;
    const salary = req.body.salary !== undefined && req.body.salary !== null && req.body.salary !== ''
      ? parseFloat(req.body.salary)
      : null;
    const hireDateRaw = req.body.hireDate ? String(req.body.hireDate) : null;
    const hireDate = hireDateRaw ? new Date(hireDateRaw) : new Date();

    const departmentId = req.body.departmentId !== undefined && req.body.departmentId !== null
      ? parseInt(req.body.departmentId, 10)
      : null;

    const status = req.body.status;
    const isActive = status === 'active' || status === true || status === 1;

    const employeeCode = `EMP-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    const created = await Employee.create({
      companyId,
      departmentId,
      firstName: firstName || 'Employee',
      lastName,
      email,
      position,
      salary: Number.isFinite(salary) ? salary : null,
      hireDate,
      employeeCode,
      isActive
    });

    return ResponseHelper.created(res, created, 'Employee created successfully');
  } catch (error) {
    return ResponseHelper.error(res, 'Failed to create employee');
  }
});

/**
 * @swagger
 * /hr/departments:
 *   get:
 *     summary: List departments
 */
router.get('/departments', async (req, res) => {
  try {
    const companyId = req.user?.companyId;
    const rows = await Department.findAll({
      where: companyId ? { companyId } : undefined,
      order: [['created_at', 'DESC']],
    });
    return ResponseHelper.success(res, rows, 'Departments retrieved successfully');
  } catch (error) {
    return ResponseHelper.error(res, 'Failed to retrieve departments');
  }
});

/**
 * @swagger
 * /hr/departments:
 *   post:
 *     summary: Create a new department
 */
router.post('/departments', [
  body('name').notEmpty().withMessage('Department name is required'),
  body('managerId').optional().isInt(),
  body('description').optional().isString(),
], async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const { name, managerId, description } = req.body;

    const created = await Department.create({
      companyId,
      name: String(name).trim(),
      managerId: managerId !== undefined && managerId !== null ? parseInt(managerId, 10) : null,
      description: description || null,
    });

    return ResponseHelper.created(res, created, 'Department created successfully');
  } catch (error) {
    return ResponseHelper.error(res, 'Failed to create department');
  }
});

/**
 * @swagger
 * /hr/employees/{id}:
 *   get:
 *     summary: Get employee by ID
 *     tags: [HR & Payroll]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Employee retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Employee'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get('/employees/:id', [
  param('id').isInt().withMessage('Valid employee ID is required')
], async (req, res) => {
  try {
    const { id } = req.params;
    // TODO: Implement employee retrieval logic
    return ResponseHelper.success(res, { id }, 'Employee retrieved successfully');
  } catch (error) {
    return ResponseHelper.error(res, 'Failed to retrieve employee');
  }
});

/**
 * @swagger
 * /hr/attendance:
 *   get:
 *     summary: Get attendance records
 *     tags: [HR & Payroll]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/PageParam'
 *       - $ref: '#/components/parameters/LimitParam'
 *       - name: startDate
 *         in: query
 *         description: Start date (YYYY-MM-DD)
 *         schema:
 *           type: string
 *           format: date
 *       - name: endDate
 *         in: query
 *         description: End date (YYYY-MM-DD)
 *         schema:
 *           type: string
 *           format: date
 *       - name: employeeId
 *         in: query
 *         description: Filter by employee ID
 *         schema:
 *           type: integer
 *       - name: status
 *         in: query
 *         description: Filter by attendance status
 *         schema:
 *           type: string
 *           enum: [present, absent, late, half_day]
 *     responses:
 *       200:
 *         description: Attendance records retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/PaginatedResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Attendance'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.get('/attendance', [
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601(),
  query('employeeId').optional().isInt(),
  query('status').optional().isIn(['present', 'absent', 'late', 'half_day'])
], async (req, res) => {
  try {
    const where = {};
    if (req.query.employeeId) where.employeeId = parseInt(req.query.employeeId, 10);
    if (req.query.status) where.status = req.query.status;
    if (req.query.startDate || req.query.endDate) {
      where.date = {};
      if (req.query.startDate) where.date[Op.gte] = req.query.startDate;
      if (req.query.endDate) where.date[Op.lte] = req.query.endDate;
    }

    const rows = await Attendance.findAll({
      where,
      include: [{
        model: Employee,
        as: 'employee',
        attributes: ['id', 'companyId', 'firstName', 'lastName', 'employeeCode'],
        where: req.user?.companyId ? { companyId: req.user.companyId } : undefined,
        required: true,
      }],
      limit: Math.min(parseInt(req.query.limit, 10) || 100, 200),
      offset: ((parseInt(req.query.page, 10) || 1) - 1) * (Math.min(parseInt(req.query.limit, 10) || 100, 200)),
      order: [['date', 'DESC']],
    });

    return ResponseHelper.success(res, rows, 'Attendance records retrieved successfully');
  } catch (error) {
    if (isSchemaIssue(error)) {
      return ResponseHelper.success(res, [], 'Attendance records retrieved successfully');
    }
    return ResponseHelper.error(res, 'Failed to retrieve attendance records');
  }
});

/**
 * @swagger
 * /hr/attendance:
 *   post:
 *     summary: Record attendance
 *     tags: [HR & Payroll]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - employeeId
 *               - date
 *               - status
 *             properties:
 *               employeeId:
 *                 type: integer
 *                 description: Employee ID
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Attendance date
 *               checkIn:
 *                 type: string
 *                 format: time
 *                 description: Check-in time
 *               checkOut:
 *                 type: string
 *                 format: time
 *                 description: Check-out time
 *               breakDuration:
 *                 type: integer
 *                 description: Break duration in minutes
 *               overtimeHours:
 *                 type: number
 *                 description: Overtime hours
 *               status:
 *                 type: string
 *                 enum: [present, absent, late, half_day]
 *                 description: Attendance status
 *               notes:
 *                 type: string
 *                 description: Additional notes
 *     responses:
 *       201:
 *         description: Attendance recorded successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Attendance'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.post('/attendance', [
  body('employeeId').isInt().withMessage('Valid employee ID is required'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('status').isIn(['present', 'absent', 'late', 'half_day']).withMessage('Valid status is required')
], async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const employeeId = parseInt(req.body.employeeId, 10);

    const employee = await Employee.findOne({
      where: { id: employeeId, companyId },
      attributes: ['id']
    });

    if (!employee) {
      return ResponseHelper.notFound(res, 'Employee not found');
    }

    const date = String(req.body.date);
    const status = req.body.status;

    const breakDuration = req.body.breakDuration !== undefined && req.body.breakDuration !== null
      ? parseInt(req.body.breakDuration, 10)
      : 0;
    const overtimeHours = req.body.overtimeHours !== undefined && req.body.overtimeHours !== null
      ? parseFloat(req.body.overtimeHours)
      : 0;

    const created = await Attendance.create({
      employeeId,
      date,
      checkIn: req.body.checkIn ? String(req.body.checkIn) : null,
      checkOut: req.body.checkOut ? String(req.body.checkOut) : null,
      breakDuration: Number.isFinite(breakDuration) ? breakDuration : 0,
      overtimeHours: Number.isFinite(overtimeHours) ? overtimeHours : 0,
      status,
      notes: req.body.notes ? String(req.body.notes) : null
    });

    return ResponseHelper.created(res, created, 'Attendance recorded successfully');
  } catch (error) {
    return ResponseHelper.error(res, 'Failed to record attendance');
  }
});

/**
 * @swagger
 * /hr/payroll:
 *   get:
 *     summary: Get payroll records
 *     tags: [HR & Payroll]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/PageParam'
 *       - $ref: '#/components/parameters/LimitParam'
 *       - name: startDate
 *         in: query
 *         description: Pay period start date
 *         schema:
 *           type: string
 *           format: date
 *       - name: endDate
 *         in: query
 *         description: Pay period end date
 *         schema:
 *           type: string
 *           format: date
 *       - name: employeeId
 *         in: query
 *         description: Filter by employee ID
 *         schema:
 *           type: integer
 *       - name: status
 *         in: query
 *         description: Filter by payroll status
 *         schema:
 *           type: string
 *           enum: [draft, approved, paid]
 *     responses:
 *       200:
 *         description: Payroll records retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/PaginatedResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Payroll'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.get('/payroll', [
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601(),
  query('employeeId').optional().isInt(),
  query('status').optional().isIn(['draft', 'approved', 'paid'])
], async (req, res) => {
  try {
    const where = {};
    if (req.query.employeeId) where.employeeId = parseInt(req.query.employeeId, 10);
    if (req.query.status) where.status = req.query.status;
    if (req.query.startDate || req.query.endDate) {
      where.payPeriodStart = {};
      if (req.query.startDate) where.payPeriodStart[Op.gte] = req.query.startDate;
      if (req.query.endDate) where.payPeriodStart[Op.lte] = req.query.endDate;
    }

    const rows = await Payroll.findAll({
      where,
      include: [{
        model: Employee,
        as: 'employee',
        attributes: ['id', 'companyId', 'firstName', 'lastName', 'employeeCode'],
        where: req.user?.companyId ? { companyId: req.user.companyId } : undefined,
        required: true,
      }],
      limit: Math.min(parseInt(req.query.limit, 10) || 100, 200),
      offset: ((parseInt(req.query.page, 10) || 1) - 1) * (Math.min(parseInt(req.query.limit, 10) || 100, 200)),
      order: [['pay_period_start', 'DESC']],
    });

    return ResponseHelper.success(res, rows, 'Payroll records retrieved successfully');
  } catch (error) {
    if (isSchemaIssue(error)) {
      return ResponseHelper.success(res, [], 'Payroll records retrieved successfully');
    }
    return ResponseHelper.error(res, 'Failed to retrieve payroll records');
  }
});

/**
 * @swagger
 * /hr/payroll:
 *   post:
 *     summary: Generate payroll
 *     tags: [HR & Payroll]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - payPeriodStart
 *               - payPeriodEnd
 *               - employeeIds
 *             properties:
 *               payPeriodStart:
 *                 type: string
 *                 format: date
 *                 description: Pay period start date
 *               payPeriodEnd:
 *                 type: string
 *                 format: date
 *                 description: Pay period end date
 *               employeeIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: Array of employee IDs
 *     responses:
 *       201:
 *         description: Payroll generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Payroll'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.post('/payroll', [
  body('payPeriodStart').isISO8601().withMessage('Valid pay period start date is required'),
  body('payPeriodEnd').isISO8601().withMessage('Valid pay period end date is required'),
  body('employeeIds').isArray().withMessage('Employee IDs array is required')
], async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const payPeriodStart = String(req.body.payPeriodStart);
    const payPeriodEnd = String(req.body.payPeriodEnd);
    const employeeIds = (req.body.employeeIds || []).map((id) => parseInt(id, 10)).filter((n) => Number.isFinite(n));

    if (!employeeIds.length) {
      return ResponseHelper.badRequest(res, 'Employee IDs array cannot be empty');
    }

    const employees = await Employee.findAll({
      where: { id: employeeIds, companyId },
      attributes: ['id', 'salary']
    });

    const createdRows = [];
    for (const emp of employees) {
      const basicSalary = emp.salary !== null && emp.salary !== undefined ? parseFloat(emp.salary) : 0;

      const created = await Payroll.create({
        employeeId: emp.id,
        payPeriodStart,
        payPeriodEnd,
        basicSalary: Number.isFinite(basicSalary) ? basicSalary : 0,
        overtimePay: 0,
        deductions: 0,
        bonuses: 0,
        netSalary: Number.isFinite(basicSalary) ? basicSalary : 0,
        status: 'draft',
        paymentDate: null
      });

      createdRows.push(created);
    }

    return ResponseHelper.created(res, createdRows, 'Payroll generated successfully');
  } catch (error) {
    return ResponseHelper.error(res, 'Failed to generate payroll');
  }
});

module.exports = router;
