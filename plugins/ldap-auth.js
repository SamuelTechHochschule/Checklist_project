const ldap = require('ldapjs');

const ldapClient = ldap.createClient({
    url: ''
});

export default({ app }, inject => {
    inject('ldapAuth', {
        async authenticate(username, password) {
            return new Promise((resolve, reject) => {
                const bindDN = `uid=${username}, ou=users, dc=example, dc=com`;

                ldapClient.bind(bindDN, password, (err) => {
                    if(err){
                        reject(err);
                    }else{
                        resolve(true);
                    }
                });
            });
        },
    });
});