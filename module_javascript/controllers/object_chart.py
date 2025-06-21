from odoo import http
from odoo.http import request

class ChartGroupController(http.Controller):

    @http.route('/module_javascript/read_group_chart_data', type='json', auth='user')
    def get_grouped_chart_data(self):
        result = request.env['todo.task'].read_group(
            domain=[],
            fields=['is_done', 'create_uid'],
            groupby=['is_done', 'create_uid'],
            lazy=False
        )
        
        # Chuẩn bị dữ liệu cho từng biểu đồ
        chart_data = {
            # Biểu đồ 1: Tổng hợp is_done (True/False)
            'doughnut_chart': {
                'labels': ['Chưa hoàn thành', 'Đã hoàn thành'],
                'data': [0, 0],  # [Tổng False, Tổng True]
                'colors': ['#FF6384', '#36A2EB']
            },
            # Biểu đồ 2: Cột - User vs Task đã hoàn thành (is_done=True)
            'bar_chart_done': {
                'labels': [],  # Tên user
                'data': [],    # Số task hoàn thành
                'color': '#4BC0C0'
            },
            # Biểu đồ 3: Cột - User vs Task chưa hoàn thành (is_done=False)
            'bar_chart_not_done': {
                'labels': [],
                'data': [],
                'color': '#FF9966'
            }
        }
        
        # Điền dữ liệu vào cấu trúc
        for group in result:
            if group['is_done']:
                # Cộng vào biểu đồ tròn (phần Đã hoàn thành)
                chart_data['doughnut_chart']['data'][1] += group['__count']
                
                # Thêm vào biểu đồ cột (Task đã hoàn thành)
                chart_data['bar_chart_done']['labels'].append(group['create_uid'][1])  # Tên user
                chart_data['bar_chart_done']['data'].append(group['__count'])
            else:
                # Cộng vào biểu đồ tròn (phần Chưa hoàn thành)
                chart_data['doughnut_chart']['data'][0] += group['__count']
                
                # Thêm vào biểu đồ cột (Task chưa hoàn thành)
                chart_data['bar_chart_not_done']['labels'].append(group['create_uid'][1])
                chart_data['bar_chart_not_done']['data'].append(group['__count'])
        
        return chart_data