const getCookieValue = (name) => (document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || '')

var vue = new Vue({
	el: '#app',
	data: {
        api: {
            login: {
                url: `${window.location.origin}/api/login`,
                method: "POST",
                require_auth: false,
            },
            register: {
                url: `${window.location.origin}/api/register`,
                method: "POST",
                require_auth: false,
            },
            logout: {
                url: `${window.location.origin}/api/logout`,
                method: "POST",
                require_auth: true,
            },
            update_password: {
                url: `${window.location.origin}/api/updatePassword`,
                method: "PATCH",
                require_auth: true,
            },
            submit_info: {
                url: `${window.location.origin}/api/createMenu`,
                method: "POST",
                require_auth: true,
                no_body_encoding: true,
            },
            delete_account: {
                url: `${window.location.origin}/api/deleteAccount`,
                method: "DELETE",
                require_auth: true,
            },
            load_menu: {
                url: `${window.location.origin}/api/loadMenu`,
                method: "GET",
                require_auth: true,
            },
        },
		modal_active: false,
        modal_type: "",
        week_menu: {}
	},

	mounted: async function() {
        console.log(document.cookie)
        if (getCookieValue('user') === "") {
            this.enableModal('login');
        } else {
            await this.sendRequest('load_menu');
        }
	},

	methods: {
        enableModal: function(type) {
            this.modal_type = type;
            this.modal_active = true;
        },
        encodeRequestBody: function(data) {
            for (let key in data) {
                data[key] = btoa(data[key]);
            }
            return data;
        },
        processSuccessfulRequest: async function(type, response) {
            switch (type) {
                case "login":
                case "register":
                    await this.sendRequest('load_menu');
                break;
                case "delete_account":
                case "update_password":
                    window.location.reload()
                break;
                case "load_menu":
                case "submit_info":
                    await response.json().then(data => {
                        this.week_menu = data;
                    })
                break;
            }
            
        },
        sendRequest: async function(type, data) {
            const url = this.api[type].url;

            const headers = {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Access-Control-Allow-Origin': '*',
            }

            if (!this.api[type].no_body_encoding) {
                data = this.encodeRequestBody(data)
            }

            if (this.api[type].require_auth) {
                headers['Auth-Token'] = getCookieValue("token");
            }

            try {
				let response = await fetch(url, {
					method: this.api[type].method,
					headers: headers,
                    body: JSON.stringify(data)
				})

				if (response.status == 200) {
                    this.modal_active = false;
                    await this.processSuccessfulRequest(type, response);
				} else {
					alert('Response error: ' + response.status);
				}
			} catch (e) {
				alert(e);
			}
        },
	}

});
