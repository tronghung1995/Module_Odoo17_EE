/** @odoo-module **/

import { Component, onMounted, useRef } from "@odoo/owl";
import { useService } from "@web/core/utils/hooks";
import { registry } from "@web/core/registry";


export class ChartComponent extends Component {
    
    static template = "module_javascript.ChartComponent";

    setup() {
        this.rpc = useService("rpc");
        this.canvasRef = useRef("chartCanvas");
        this.canvasRefDone = useRef("chartCanvasDone");
        this.canvasRefNotDone = useRef("chartCanvasNotDone");

        onMounted(async () => {
            const data = await this.rpc('/module_javascript/read_group_chart_data');

            const ctx = this.canvasRef.el.getContext("2d");
            new Chart(ctx, {
                type: "doughnut",
                data: {
                    labels: data.doughnut_chart.labels,
                    datasets: [{
                        label: "Quantity",
                        data: data.doughnut_chart.data,
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
                            text: 'Total Tasks'
                        }
                    }
                },
            });

            const ctxDone = this.canvasRefDone.el.getContext("2d");
            new Chart(ctxDone, {
                type: "bar",
                data: {
                    labels: data.bar_chart_done.labels,
                    datasets: [{
                        label: "Quantity",
                        data: data.bar_chart_done.data,
                        backgroundColor: ["Red", "Blue"],
                        borderWidth: 1,
                    }],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false,
                        },
                        title: {
                            display: true,
                            text: 'Task Done'
                        }
                    },
                    scales: {
                        y: { // trục Y
                            ticks: {
                                callback: function(value) {
                                    return Number.isInteger(value) ? value : ''; // Chỉ hiển thị số nguyên
                                }
                            }
                        }
                    }
                }
            });

            const ctxNotDone = this.canvasRefNotDone.el.getContext("2d");
            new Chart(ctxNotDone, {
                type: "bar",
                data: {
                    labels: data.bar_chart_not_done.labels,
                    datasets: [{
                        label: "Quantity",
                        data: data.bar_chart_not_done.data,
                        backgroundColor: ["Red", "Blue"],
                        borderWidth: 1,
                    }],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false,
                        },
                        title: {
                            display: true,
                            text: 'Task Not Done'
                        }
                    },
                    scales: {
                        y: { // trục Y
                            ticks: {
                                callback: function(value) {
                                    return Number.isInteger(value) ? value : ''; // Chỉ hiển thị số nguyên
                                }
                            }
                        }
                    }
                },
            });

        });
    }
}

registry.category("actions").add("module_javascript.chartcomponent", ChartComponent);
