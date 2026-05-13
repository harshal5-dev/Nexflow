import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import config from '../config/index.js';

const protectedSecurity = [{ bearerAuth: [] }, { cookieAuth: [] }];

const swaggerDefinition = {
  openapi: '3.0.3',
  info: {
    title: 'Nexflow API',
    version: '1.0.0',
    description:
      'Detailed API documentation for authentication, users, roles, tenants, and projects.',
  },
  servers: [
    {
      url: `http://localhost:${config.server.port}`,
      description: 'Local development server',
    },
  ],
  tags: [
    { name: 'Auth', description: 'Authentication and account endpoints' },
    { name: 'Users', description: 'Tenant member management endpoints' },
    { name: 'Roles', description: 'Role and permission management endpoints' },
    { name: 'Tenants', description: 'Tenant profile management endpoints' },
    { name: 'Projects', description: 'Project management endpoints' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description:
          'Paste the JWT returned after sign-in. Format: `Bearer <token>`.',
      },
      cookieAuth: {
        type: 'apiKey',
        in: 'cookie',
        name: config.cookies.jwt_token_name,
        description: `Session JWT cookie named \`${config.cookies.jwt_token_name}\`.`,
      },
    },
    schemas: {
      ApiSuccessResponse: {
        type: 'object',
        properties: {
          isSuccess: { type: 'boolean', example: true },
          message: {
            type: 'string',
            example: 'Request completed successfully',
          },
          data: { type: 'object', nullable: true },
          path: { type: 'string', example: '/api/v1/auth/signin' },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
      ApiErrorResponse: {
        type: 'object',
        properties: {
          isSuccess: { type: 'boolean', example: false },
          message: { type: 'string', example: 'Invalid request data' },
          path: { type: 'string', example: '/api/v1/auth/signup' },
          validationErrors: {
            type: 'object',
            nullable: true,
            additionalProperties: {
              type: 'array',
              items: { type: 'string' },
            },
          },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
      Tenant: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '681cdf766d843155bda72421' },
          name: { type: 'string', example: 'acme-organization' },
          description: { type: 'string', example: 'Primary tenant workspace' },
        },
      },
      Role: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '681cdf766d843155bda72454' },
          name: { type: 'string', example: 'Project Manager' },
          description: {
            type: 'string',
            example: 'Manages projects and members',
          },
          code: { type: 'string', example: 'project_manager' },
          permissions: {
            type: 'array',
            items: { type: 'string' },
            example: ['MANAGE_USERS', 'CREATE_PROJECTS'],
          },
          userCount: { type: 'number', example: 4 },
        },
      },
      User: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '681cdf766d843155bda72488' },
          firstName: { type: 'string', example: 'Ava' },
          lastName: { type: 'string', example: 'Wilson' },
          emailId: { type: 'string', format: 'email', example: 'ava@acme.com' },
          profilePictureUrl: { type: 'string', example: '' },
          tenantId: { type: 'string', example: '681cdf766d843155bda72421' },
          tenant: { $ref: '#/components/schemas/Tenant' },
          roles: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                _id: { type: 'string', example: '681cdf766d843155bda72454' },
                name: { type: 'string', example: 'Owner' },
                code: { type: 'string', example: 'PLATFORM_OWNER' },
                description: { type: 'string', example: 'Tenant owner role' },
              },
            },
          },
          permissions: {
            type: 'array',
            items: { type: 'string' },
            example: ['MANAGE_USERS', 'MANAGE_ROLES', 'VIEW_TEAM_STATS'],
          },
          status: {
            type: 'string',
            enum: ['INVITED', 'ACTIVE', 'DISABLED', 'SUSPENDED', 'DELETED'],
            example: 'ACTIVE',
          },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      Project: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '681cdf766d843155bda72495' },
          name: { type: 'string', example: 'Nexflow Platform Revamp' },
          description: {
            type: 'string',
            example: 'Project for Q4 release scope',
          },
          status: {
            type: 'string',
            enum: [
              'IN_PROGRESS',
              'COMPLETED',
              'ARCHIVED',
              'CANCELLED',
              'ON_HOLD',
              'REVIEW',
            ],
            example: 'IN_PROGRESS',
          },
          dueDate: { type: 'string', format: 'date-time' },
          tenantId: { type: 'string', example: '681cdf766d843155bda72421' },
          assignees: {
            type: 'array',
            items: { type: 'string' },
            example: ['681cdf766d843155bda72488'],
          },
          tasks: {
            type: 'array',
            items: { type: 'string' },
            example: [],
          },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      TeamStats: {
        type: 'object',
        properties: {
          totalUsers: { type: 'number', example: 12 },
          totalRoles: { type: 'number', example: 4 },
          totalPermissions: { type: 'number', example: 14 },
          totalMultiRoleMembers: { type: 'number', example: 3 },
        },
      },
      SignUpRequest: {
        type: 'object',
        required: ['firstName', 'emailId', 'password'],
        properties: {
          firstName: { type: 'string', example: 'Ava' },
          lastName: { type: 'string', example: 'Wilson' },
          emailId: { type: 'string', format: 'email', example: 'ava@acme.com' },
          password: {
            type: 'string',
            minLength: 8,
            maxLength: 15,
            example: 'Abcd1234',
          },
        },
      },
      SignInRequest: {
        type: 'object',
        required: ['emailId', 'password'],
        properties: {
          emailId: { type: 'string', format: 'email', example: 'ava@acme.com' },
          password: {
            type: 'string',
            minLength: 8,
            maxLength: 15,
            example: 'Abcd1234',
          },
        },
      },
      ForgotPasswordRequest: {
        type: 'object',
        required: ['emailId'],
        properties: {
          emailId: { type: 'string', format: 'email', example: 'ava@acme.com' },
        },
      },
      ResetPasswordRequest: {
        type: 'object',
        required: ['emailId', 'otp', 'password'],
        properties: {
          emailId: { type: 'string', format: 'email', example: 'ava@acme.com' },
          otp: {
            type: 'string',
            minLength: 6,
            maxLength: 6,
            example: '764321',
          },
          password: {
            type: 'string',
            minLength: 8,
            maxLength: 15,
            example: 'NewPass123',
          },
        },
      },
      UpdateProfileRequest: {
        type: 'object',
        required: ['firstName'],
        properties: {
          firstName: { type: 'string', example: 'Ava' },
          lastName: { type: 'string', example: 'Williams' },
        },
      },
      AcceptInvitationRequest: {
        type: 'object',
        required: ['token', 'password'],
        properties: {
          token: { type: 'string', example: 'invitation-token-from-email' },
          password: { type: 'string', example: 'SecurePass123' },
        },
      },
      UpdateTenantRequest: {
        type: 'object',
        required: ['name'],
        properties: {
          name: { type: 'string', example: 'Acme Workspace' },
          description: {
            type: 'string',
            example: 'Tenant profile description',
          },
        },
      },
      ManageRoleRequest: {
        type: 'object',
        required: ['name', 'permissions'],
        properties: {
          name: { type: 'string', example: 'Developer' },
          description: { type: 'string', example: 'Developer access role' },
          permissions: {
            type: 'array',
            items: { type: 'string' },
            example: ['VIEW_LIST_PROJECTS', 'CREATE_TASKS', 'UPDATE_TASKS'],
          },
        },
      },
      CreateMemberRequest: {
        type: 'object',
        required: ['firstName', 'emailId', 'roles'],
        properties: {
          firstName: { type: 'string', example: 'Noah' },
          lastName: { type: 'string', example: 'Stone' },
          emailId: {
            type: 'string',
            format: 'email',
            example: 'noah@acme.com',
          },
          roles: {
            type: 'array',
            items: { type: 'string' },
            example: ['681cdf766d843155bda72454'],
          },
        },
      },
      UpdateMemberRequest: {
        type: 'object',
        required: ['firstName', 'roles'],
        properties: {
          firstName: { type: 'string', example: 'Noah' },
          lastName: { type: 'string', example: 'Stoner' },
          roles: {
            type: 'array',
            items: { type: 'string' },
            example: ['681cdf766d843155bda72454'],
          },
        },
      },
      ManageProjectRequest: {
        type: 'object',
        required: ['name', 'status', 'dueDate', 'assignees'],
        properties: {
          name: { type: 'string', example: 'Nexflow API hardening' },
          description: {
            type: 'string',
            example: 'Security, docs, and UX improvements',
          },
          status: {
            type: 'string',
            enum: [
              'IN_PROGRESS',
              'COMPLETED',
              'ARCHIVED',
              'CANCELLED',
              'ON_HOLD',
              'REVIEW',
            ],
            example: 'IN_PROGRESS',
          },
          dueDate: {
            type: 'string',
            format: 'date-time',
            example: '2026-05-31T10:00:00.000Z',
          },
          assignees: {
            type: 'array',
            items: { type: 'string' },
            example: ['681cdf766d843155bda72488'],
          },
        },
      },
    },
    parameters: {
      userIdParam: {
        name: 'userId',
        in: 'path',
        required: true,
        schema: { type: 'string' },
        description: 'Target user identifier',
      },
      roleIdParam: {
        name: 'id',
        in: 'path',
        required: true,
        schema: { type: 'string' },
        description: 'Role identifier',
      },
    },
  },
  paths: {
    '/api/v1/auth/signup': {
      post: {
        tags: ['Auth'],
        summary: 'Sign up and create tenant owner account',
        description:
          'Creates tenant, owner role assignment, and user account in a single transaction.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/SignUpRequest' },
            },
          },
        },
        responses: {
          201: {
            description: 'User signed up successfully',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiSuccessResponse' },
                    {
                      properties: {
                        data: {
                          type: 'object',
                          properties: {
                            _id: { type: 'string' },
                            firstName: { type: 'string' },
                            lastName: { type: 'string' },
                            emailId: { type: 'string' },
                            tenantId: { type: 'string' },
                          },
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
          400: {
            description: 'Invalid request',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/v1/auth/signin': {
      post: {
        tags: ['Auth'],
        summary: 'Sign in and create JWT session',
        description:
          'Validates credentials, sets JWT cookie, and also returns token in response data.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/SignInRequest' },
            },
          },
        },
        responses: {
          200: {
            description: 'User signed in successfully',
            headers: {
              'Set-Cookie': {
                schema: { type: 'string' },
                description: 'HTTP-only session cookie with JWT token.',
              },
            },
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiSuccessResponse' },
                    {
                      properties: {
                        data: {
                          type: 'object',
                          properties: {
                            token: { type: 'string' },
                            isAuthenticated: { type: 'boolean', example: true },
                            user: { $ref: '#/components/schemas/User' },
                          },
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
          401: {
            description: 'Invalid credentials',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/v1/auth/forgot-password': {
      post: {
        tags: ['Auth'],
        summary: 'Send reset password OTP',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ForgotPasswordRequest' },
            },
          },
        },
        responses: {
          200: {
            description: 'OTP sent successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiSuccessResponse' },
              },
            },
          },
          400: {
            description: 'Invalid request',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/v1/auth/reset-password': {
      post: {
        tags: ['Auth'],
        summary: 'Verify OTP and reset password',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ResetPasswordRequest' },
            },
          },
        },
        responses: {
          200: {
            description: 'Password reset successful',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiSuccessResponse' },
              },
            },
          },
          400: {
            description: 'Invalid OTP/request',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/v1/auth/me': {
      get: {
        tags: ['Auth'],
        summary: 'Get current auth status',
        description:
          'Returns authenticated user profile when token exists in cookie or bearer header.',
        responses: {
          200: {
            description: 'Auth status fetched',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiSuccessResponse' },
                    {
                      properties: {
                        data: {
                          type: 'object',
                          properties: {
                            isAuthenticated: { type: 'boolean' },
                            user: {
                              oneOf: [
                                { $ref: '#/components/schemas/User' },
                                { type: 'null' },
                              ],
                            },
                          },
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
        },
      },
    },
    '/api/v1/auth/update': {
      put: {
        tags: ['Auth'],
        summary: 'Update current user profile',
        security: protectedSecurity,
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateProfileRequest' },
            },
          },
        },
        responses: {
          200: {
            description: 'Profile updated',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiSuccessResponse' },
                    {
                      properties: {
                        data: {
                          type: 'object',
                          properties: {
                            _id: { type: 'string' },
                            firstName: { type: 'string' },
                            lastName: { type: 'string' },
                            emailId: { type: 'string' },
                            tenantId: { type: 'string' },
                          },
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
          401: {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/v1/auth/signout': {
      post: {
        tags: ['Auth'],
        summary: 'Sign out current user',
        security: protectedSecurity,
        responses: {
          200: {
            description: 'User signed out',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiSuccessResponse' },
              },
            },
          },
          401: {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/v1/auth/accept-invitation': {
      post: {
        tags: ['Auth'],
        summary: 'Accept invitation and set password',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/AcceptInvitationRequest' },
            },
          },
        },
        responses: {
          200: {
            description: 'Invitation accepted',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiSuccessResponse' },
                    {
                      properties: {
                        data: { $ref: '#/components/schemas/User' },
                      },
                    },
                  ],
                },
              },
            },
          },
          400: {
            description: 'Invalid invitation token or request',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/v1/tenants': {
      put: {
        tags: ['Tenants'],
        summary: 'Update tenant profile',
        description: 'Requires `UPDATE_TENANT` permission.',
        security: protectedSecurity,
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateTenantRequest' },
            },
          },
        },
        responses: {
          200: {
            description: 'Tenant updated',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiSuccessResponse' },
                    {
                      properties: {
                        data: { $ref: '#/components/schemas/Tenant' },
                      },
                    },
                  ],
                },
              },
            },
          },
          403: {
            description: 'Forbidden',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/v1/roles/permissions': {
      get: {
        tags: ['Roles'],
        summary: 'Get available permission keys',
        security: protectedSecurity,
        responses: {
          200: {
            description: 'Permissions fetched',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiSuccessResponse' },
                    {
                      properties: {
                        data: {
                          type: 'array',
                          items: { type: 'string' },
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
        },
      },
    },
    '/api/v1/roles': {
      get: {
        tags: ['Roles'],
        summary: 'List tenant roles',
        description: 'Requires `MANAGE_ROLES` or `VIEW_LIST_ROLES` permission.',
        security: protectedSecurity,
        responses: {
          200: {
            description: 'Roles fetched',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiSuccessResponse' },
                    {
                      properties: {
                        data: {
                          type: 'array',
                          items: { $ref: '#/components/schemas/Role' },
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
          403: {
            description: 'Forbidden',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiErrorResponse' },
              },
            },
          },
        },
      },
      post: {
        tags: ['Roles'],
        summary: 'Create a role',
        description: 'Requires `MANAGE_ROLES` permission.',
        security: protectedSecurity,
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ManageRoleRequest' },
            },
          },
        },
        responses: {
          201: {
            description: 'Role created',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiSuccessResponse' },
                    {
                      properties: {
                        data: { $ref: '#/components/schemas/Role' },
                      },
                    },
                  ],
                },
              },
            },
          },
          400: {
            description: 'Invalid request or role already exists',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiErrorResponse' },
              },
            },
          },
          403: {
            description: 'Forbidden',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/v1/roles/{id}': {
      put: {
        tags: ['Roles'],
        summary: 'Update role',
        description: 'Requires `MANAGE_ROLES` permission.',
        security: protectedSecurity,
        parameters: [{ $ref: '#/components/parameters/roleIdParam' }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ManageRoleRequest' },
            },
          },
        },
        responses: {
          200: {
            description: 'Role updated',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiSuccessResponse' },
                    {
                      properties: {
                        data: { $ref: '#/components/schemas/Role' },
                      },
                    },
                  ],
                },
              },
            },
          },
          403: {
            description: 'Forbidden',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/v1/users': {
      get: {
        tags: ['Users'],
        summary: 'List tenant members',
        description: 'Requires `MANAGE_USERS` or `VIEW_LIST_USERS` permission.',
        security: protectedSecurity,
        responses: {
          200: {
            description: 'Members retrieved',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiSuccessResponse' },
                    {
                      properties: {
                        data: {
                          type: 'array',
                          items: { $ref: '#/components/schemas/User' },
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
          403: {
            description: 'Forbidden',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiErrorResponse' },
              },
            },
          },
        },
      },
      post: {
        tags: ['Users'],
        summary: 'Create a member and send invitation',
        description: 'Requires `MANAGE_USERS` permission.',
        security: protectedSecurity,
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateMemberRequest' },
            },
          },
        },
        responses: {
          201: {
            description: 'Member created',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiSuccessResponse' },
                    {
                      properties: {
                        data: { $ref: '#/components/schemas/User' },
                      },
                    },
                  ],
                },
              },
            },
          },
          403: {
            description: 'Forbidden',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/v1/users/team-states': {
      get: {
        tags: ['Users'],
        summary: 'Get tenant team statistics',
        description: 'Requires `MANAGE_USERS` or `VIEW_TEAM_STATS` permission.',
        security: protectedSecurity,
        responses: {
          200: {
            description: 'Team stats retrieved',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiSuccessResponse' },
                    {
                      properties: {
                        data: { $ref: '#/components/schemas/TeamStats' },
                      },
                    },
                  ],
                },
              },
            },
          },
          403: {
            description: 'Forbidden',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/v1/users/{userId}': {
      put: {
        tags: ['Users'],
        summary: 'Update member profile and roles',
        description: 'Requires `MANAGE_USERS` permission.',
        security: protectedSecurity,
        parameters: [{ $ref: '#/components/parameters/userIdParam' }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateMemberRequest' },
            },
          },
        },
        responses: {
          200: {
            description: 'Member updated',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiSuccessResponse' },
                    {
                      properties: {
                        data: { $ref: '#/components/schemas/User' },
                      },
                    },
                  ],
                },
              },
            },
          },
          403: {
            description: 'Forbidden',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiErrorResponse' },
              },
            },
          },
        },
      },
      delete: {
        tags: ['Users'],
        summary: 'Soft delete member',
        description: 'Requires `MANAGE_USERS` permission.',
        security: protectedSecurity,
        parameters: [{ $ref: '#/components/parameters/userIdParam' }],
        responses: {
          200: {
            description: 'Member deleted',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiSuccessResponse' },
                    {
                      properties: {
                        data: { $ref: '#/components/schemas/User' },
                      },
                    },
                  ],
                },
              },
            },
          },
          403: {
            description: 'Forbidden',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/v1/projects': {
      post: {
        tags: ['Projects'],
        summary: 'Create a project',
        description: 'Requires `CREATE_PROJECTS` permission.',
        security: protectedSecurity,
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ManageProjectRequest' },
            },
          },
        },
        responses: {
          200: {
            description: 'Project created',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiSuccessResponse' },
                    {
                      properties: {
                        data: { $ref: '#/components/schemas/Project' },
                      },
                    },
                  ],
                },
              },
            },
          },
          403: {
            description: 'Forbidden',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiErrorResponse' },
              },
            },
          },
        },
      },
    },
  },
};

const swaggerOptions = {
  definition: swaggerDefinition,
  apis: [],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

const setupSwagger = app => {
  app.get('/api-docs.json', (_req, res) => {
    return res.status(200).json(swaggerSpec);
  });

  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      customSiteTitle: 'Nexflow Swagger Docs',
      explorer: true,
      swaggerOptions: {
        displayRequestDuration: true,
        persistAuthorization: true,
      },
    })
  );
};

export default setupSwagger;
