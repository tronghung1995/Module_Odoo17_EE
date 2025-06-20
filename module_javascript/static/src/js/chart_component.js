/** @odoo-module **/

import { Component, onMounted, useRef } from "@odoo/owl";
import { useService } from "@web/core/utils/hooks";
import { registry } from "@web/core/registry";


export class ChartComponent extends Component {
    
    static template = "module_javascript.ChartComponent";

    setup() {
        this.rpc = useService("rpc");
        this.canvasRef = useRef("chartCanvas");

        onMounted(async () => {
            const data = await this.rpc('/module_javascript/read_group_chart_data');

            const title_column = data.map(item => String(item.is_done));
            const countList = data.map(item => parseInt(item.is_done_count));

            const ctx = this.canvasRef.el.getContext("2d");
            new Chart(ctx, {
                type: "pie",
                data: {
                    labels: title_column,
                    datasets: [{
                        label: "Votes",
                        data: countList,
                        backgroundColor: ["Red", "Blue"],
                        borderWidth: 1,
                    }],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'right',
                        },
                        title: {
                            display: true,
                            text: 'Chart.js Pie Chart'
                        }
                    }
                },
            });
        });
    }
}

registry.category("actions").add("module_javascript.chartcomponent", ChartComponent);
