const getCookieValue = (name) => (
    document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || ''
    )

var vue = new Vue({
	el: '#app',
	data: {
		modal_active: false,
        modal_type: "",
        week_menu: {}
	},

	mounted: async function() {
        console.log(document.cookie)
        if (getCookieValue('user') === "") {
            this.enableModal('login');
        } else {
            await this.load();
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
        processModalAction: function(type, data) {
            switch (type) {
                case "login":
                    this.login(data);
                break;
                case "register":
                    this.register(data);
                break;
                case "reset_password":
                    
                break;
                case "update_password":
                    this.updatePassword(data);
                break;
                case "submit_info":
                    this.createMenu(data);
                break;
                case "delete_account":
                    this.deleteAccount(data);
                break;
            }
            console.log('processing ', data)
        },
        logout: async function() {
            const url = `${window.location.origin}/api/logout`;

			try {
				let response = await fetch(url, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'Accept': 'application/json',
						'Access-Control-Allow-Origin': '*',
                        'Auth-Token': getCookieValue("token")
					}
				});

				if (response.status == 200) {
					window.location.reload()
				} else {
					alert('Response error: ' + response.status);
				}
			} catch (e) {
				alert(e);
			}
        },
        load: async function() {

			const url = `${window.location.origin}/api/load`;
            
			try {
				let response = await fetch(url, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						'Accept': 'application/json',
						'Access-Control-Allow-Origin': '*',
                        'Auth-Token': getCookieValue("token")
					}
				});

				if (response.status == 200) {
					await response.json().then(data => {
						this.week_menu = data;
					})
				} else {
					alert('Response error: ' + response.status);
				}
			
			} catch (e) {
				alert(e);
			}
		},
        login: async function(credentials) {

			const url = `${window.location.origin}/api/login`;

			try {
				let response = await fetch(url, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'Accept': 'application/json',
						'Access-Control-Allow-Origin': '*'
					},
                    body: JSON.stringify(this.encodeRequestBody(credentials))
				});

				if (response.status == 200) {
					this.modal_active = false;
                    await this.load();
				} else {
					alert('Response error: ' + response.status);
				}
			} catch (e) {
				alert(e);
			}
		},
        register: async function(credentials) {

			const url = `${window.location.origin}/api/register`;

			try {
				let response = await fetch(url, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'Accept': 'application/json',
						'Access-Control-Allow-Origin': '*'
					},
                    body: JSON.stringify(this.encodeRequestBody(credentials))
				});

				if (response.status == 200) {
                    this.modal_active = false;
                    await this.load();
				} else {
					alert('Response error: ' + response.status);
				}
			} catch (e) {
				alert(e);
			}
		},
        updatePassword: async function(credentials) {

			const url = `${window.location.origin}/api/updatePassword`;

			try {
				let response = await fetch(url, {
					method: 'PATCH',
					headers: {
						'Content-Type': 'application/json',
						'Accept': 'application/json',
						'Access-Control-Allow-Origin': '*',
                        'Auth-Token': getCookieValue("token")
					},
                    body: JSON.stringify(this.encodeRequestBody(credentials))
				});

				if (response.status == 200) {
					this.modal_active = false;
				} else {
					alert('Response error: ' + response.status);
				}
			} catch (e) {
				alert(e);
			}
		},
        deleteAccount: async function(credentials) {

			const url = `${window.location.origin}/api/deleteAccount`;

			try {
				let response = await fetch(url, {
					method: 'DELETE',
					headers: {
						'Content-Type': 'application/json',
						'Accept': 'application/json',
						'Access-Control-Allow-Origin': '*',
                        'Auth-Token': getCookieValue("token")
					},
                    body: JSON.stringify(credentials)
				});

				if (response.status == 200) {
					window.location.reload()
				} else {
					alert('Response error: ' + response.status);
				}
			} catch (e) {
				alert(e);
			}
		},
        createMenu: async function(data) {

			const url = `${window.location.origin}/api/createMenu`;

			try {
				let response = await fetch(url, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'Accept': 'application/json',
						'Access-Control-Allow-Origin': '*',
                        'Auth-Token': getCookieValue("token")
					},
                    body: JSON.stringify(data)
				});

				if (response.status == 200) {
					this.modal_active = false;
                    await response.json().then(data => {
						this.week_menu = data;
					})
				} else {
					alert('Response error: ' + response.status);
				}
			} catch (e) {
				alert(e);
			}
		},
	}

});
