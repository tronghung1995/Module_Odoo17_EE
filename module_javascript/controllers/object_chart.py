from odoo import http
from odoo.http import request

class ChartGroupController(http.Controller):

    @http.route('/module_javascript/read_group_chart_data', type='json', auth='user')
    def get_grouped_chart_data(self):
        result = request.env['todo.task'].read_group(
            domain=[],
            fields=['is_done'],
            groupby=['is_done']
        )
        return result