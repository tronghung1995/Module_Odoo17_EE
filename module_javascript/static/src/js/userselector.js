/** @odoo-module **/

import { Component, useState, onWillStart } from "@odoo/owl";
import { useService } from "@web/core/utils/hooks";
import { registry } from "@web/core/registry";

export class UserSelector extends Component {
    static template = "module_javascript.UserSelector";

    setup() {
        this.orm = useService("orm");
        this.state = useState({
            users: [],
            selectedUserId: null,
        });

        onWillStart(async () => {
            const users = await this.orm.searchRead("res.users", [], ["name"]);
            this.state.users = users;
        });
        
    }

    async loadUsers() {
        const users = await this.orm.searchRead("res.users", [], ["id", "name"]);
        this.state.users = users;
    }

    onUserChange(ev) {
        const userId = Number(ev.target.value);
        this.props.onChangeUser(userId);
    }
}

registry.category("actions").add("module_javascript.user_selector", UserSelector);