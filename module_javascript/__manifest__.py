{
    'name': 'Todo Javascript',
    'version': '17.0.1.0.0',
    'summary': 'Create module Todo by Javascript',
    'description': '',
    'author': 'OS',
    'website': '',
    'category': 'Custom',
    'depends': ['base'],
    'data': [
        'security/ir.model.access.csv',
        'views/todo_task_views.xml',
    ],
    'assets': {
        'web.assets_backend': [
            'module_javascript/static/src/*/*.js',
            'module_javascript/static/src/*/*.xml',
        ],
    },
    'installable': True,
    'application': True,
    'auto_install': False,
    'license': 'LGPL-3',
}