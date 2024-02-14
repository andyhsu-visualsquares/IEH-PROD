/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 * @author Andy Chan
 *
 * @ApplyTo
 * @Description
 */
define(['N/https', '../Constants/Constants'], (https, const_1) => {
    class ShopifyServices {
        constructor() {
            this._baseURL = const_1.SHOPIFY_CONFIG.BASE_URL
            this._accessToken = const_1.SHOPIFY_CONFIG.ACCESS_TOKEN
            this._headers = {
                'Content-Type': 'application/json',
                'X-Shopify-Access-Token': this._accessToken,
                Cookie: '_master_udr=eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaEpJaWt3TWpka01UQXhZaTB4TlRWakxUUm1aV010WWpCaU5DMWtZelEyWlRabVlXWmtZbUVHT2daRlJnPT0iLCJleHAiOiIyMDI1LTA5LTE1VDAzOjI5OjQ2LjMzNloiLCJwdXIiOiJjb29raWUuX21hc3Rlcl91ZHIifX0%3D--7b043c0939549f923d1901fb442781a673d756d6; _secure_admin_session_id=f4ea56b6fcd98959e9000da775e75be6; _secure_admin_session_id_csrf=f4ea56b6fcd98959e9000da775e75be6; identity-state=BAhbCUkiJTYwYTM2M2Q2MjM3MTA5YjBjM2E3OTg3ZTgzYWU5ODU4BjoGRUZJIiU3ZDEwZjE5MGI3YmMxNTgzM2VjYjIyOWMzZTBjY2I5NwY7AEZJIiU4YjNiODNiYTM1MmUyNzA0ZmE2YzA1ZjAxZjY5MWI2ZgY7AEZJIiVkNjJjMDY3ZmJhZjI1NGU0MzBhODk2YjE0YmRhMThhMgY7AEY%3D--3126a67d525e64b7afa850210dc89f8f97c17838; identity-state-60a363d6237109b0c3a7987e83ae9858=BAh7DEkiDnJldHVybi10bwY6BkVUSSI5aHR0cHM6Ly9pZWgtdGVzdC0yMDIzLm15c2hvcGlmeS5jb20vYWRtaW4vYXV0aC9sb2dpbgY7AFRJIhFyZWRpcmVjdC11cmkGOwBUSSJFaHR0cHM6Ly9pZWgtdGVzdC0yMDIzLm15c2hvcGlmeS5jb20vYWRtaW4vYXV0aC9pZGVudGl0eS9jYWxsYmFjawY7AFRJIhBzZXNzaW9uLWtleQY7AFQ6DGFjY291bnRJIg9jcmVhdGVkLWF0BjsAVGYXMTY5NDc0ODU4Ni4zNTE0NDg1SSIKbm9uY2UGOwBUSSIlZDJiYWYxMGY2OTVjNjUyMzRkYjk3NTNiMTdmNzVjNDAGOwBGSSIKc2NvcGUGOwBUWxBJIgplbWFpbAY7AFRJIjdodHRwczovL2FwaS5zaG9waWZ5LmNvbS9hdXRoL2Rlc3RpbmF0aW9ucy5yZWFkb25seQY7AFRJIgtvcGVuaWQGOwBUSSIMcHJvZmlsZQY7AFRJIk5odHRwczovL2FwaS5zaG9waWZ5LmNvbS9hdXRoL3BhcnRuZXJzLmNvbGxhYm9yYXRvci1yZWxhdGlvbnNoaXBzLnJlYWRvbmx5BjsAVEkiMGh0dHBzOi8vYXBpLnNob3BpZnkuY29tL2F1dGgvYmFua2luZy5tYW5hZ2UGOwBUSSJCaHR0cHM6Ly9hcGkuc2hvcGlmeS5jb20vYXV0aC9tZXJjaGFudC1zZXR1cC1kYXNoYm9hcmQuZ3JhcGhxbAY7AFRJIjxodHRwczovL2FwaS5zaG9waWZ5LmNvbS9hdXRoL3Nob3BpZnktY2hhdC5hZG1pbi5ncmFwaHFsBjsAVEkiN2h0dHBzOi8vYXBpLnNob3BpZnkuY29tL2F1dGgvZmxvdy53b3JrZmxvd3MubWFuYWdlBjsAVEkiPmh0dHBzOi8vYXBpLnNob3BpZnkuY29tL2F1dGgvb3JnYW5pemF0aW9uLWlkZW50aXR5Lm1hbmFnZQY7AFRJIj5odHRwczovL2FwaS5zaG9waWZ5LmNvbS9hdXRoL21lcmNoYW50LWJhbmstYWNjb3VudC5tYW5hZ2UGOwBUSSIPY29uZmlnLWtleQY7AFRJIgxkZWZhdWx0BjsAVA%3D%3D--0382f6db9c38db5bfaf38d7cf448f4d2f3673054; identity-state-7d10f190b7bc15833ecb229c3e0ccb97=BAh7DEkiDnJldHVybi10bwY6BkVUSSI5aHR0cHM6Ly9pZWgtdGVzdC0yMDIzLm15c2hvcGlmeS5jb20vYWRtaW4vYXV0aC9sb2dpbgY7AFRJIhFyZWRpcmVjdC11cmkGOwBUSSJFaHR0cHM6Ly9pZWgtdGVzdC0yMDIzLm15c2hvcGlmeS5jb20vYWRtaW4vYXV0aC9pZGVudGl0eS9jYWxsYmFjawY7AFRJIhBzZXNzaW9uLWtleQY7AFQ6DGFjY291bnRJIg9jcmVhdGVkLWF0BjsAVGYXMTY5NDc0ODY2OC41MzIzNTkxSSIKbm9uY2UGOwBUSSIlNWY4YWZiZDQ0MzJlYzcyYjEyY2JlZTViNGExMDA2MDkGOwBGSSIKc2NvcGUGOwBUWxBJIgplbWFpbAY7AFRJIjdodHRwczovL2FwaS5zaG9waWZ5LmNvbS9hdXRoL2Rlc3RpbmF0aW9ucy5yZWFkb25seQY7AFRJIgtvcGVuaWQGOwBUSSIMcHJvZmlsZQY7AFRJIk5odHRwczovL2FwaS5zaG9waWZ5LmNvbS9hdXRoL3BhcnRuZXJzLmNvbGxhYm9yYXRvci1yZWxhdGlvbnNoaXBzLnJlYWRvbmx5BjsAVEkiMGh0dHBzOi8vYXBpLnNob3BpZnkuY29tL2F1dGgvYmFua2luZy5tYW5hZ2UGOwBUSSJCaHR0cHM6Ly9hcGkuc2hvcGlmeS5jb20vYXV0aC9tZXJjaGFudC1zZXR1cC1kYXNoYm9hcmQuZ3JhcGhxbAY7AFRJIjxodHRwczovL2FwaS5zaG9waWZ5LmNvbS9hdXRoL3Nob3BpZnktY2hhdC5hZG1pbi5ncmFwaHFsBjsAVEkiN2h0dHBzOi8vYXBpLnNob3BpZnkuY29tL2F1dGgvZmxvdy53b3JrZmxvd3MubWFuYWdlBjsAVEkiPmh0dHBzOi8vYXBpLnNob3BpZnkuY29tL2F1dGgvb3JnYW5pemF0aW9uLWlkZW50aXR5Lm1hbmFnZQY7AFRJIj5odHRwczovL2FwaS5zaG9waWZ5LmNvbS9hdXRoL21lcmNoYW50LWJhbmstYWNjb3VudC5tYW5hZ2UGOwBUSSIPY29uZmlnLWtleQY7AFRJIgxkZWZhdWx0BjsAVA%3D%3D--d3e709335c8b2697ed3759b6a68fbeaa08e54377; identity-state-8b3b83ba352e2704fa6c05f01f691b6f=BAh7DEkiDnJldHVybi10bwY6BkVUSSI5aHR0cHM6Ly9pZWgtdGVzdC0yMDIzLm15c2hvcGlmeS5jb20vYWRtaW4vYXV0aC9sb2dpbgY7AFRJIhFyZWRpcmVjdC11cmkGOwBUSSJFaHR0cHM6Ly9pZWgtdGVzdC0yMDIzLm15c2hvcGlmeS5jb20vYWRtaW4vYXV0aC9pZGVudGl0eS9jYWxsYmFjawY7AFRJIhBzZXNzaW9uLWtleQY7AFQ6DGFjY291bnRJIg9jcmVhdGVkLWF0BjsAVGYWMTY5NDc0ODY4Mi4zMzI0MzNJIgpub25jZQY7AFRJIiVmZDNmOTczMWUwNThhNmFlZjMzYmE4MmRkMTA4ZjllZAY7AEZJIgpzY29wZQY7AFRbEEkiCmVtYWlsBjsAVEkiN2h0dHBzOi8vYXBpLnNob3BpZnkuY29tL2F1dGgvZGVzdGluYXRpb25zLnJlYWRvbmx5BjsAVEkiC29wZW5pZAY7AFRJIgxwcm9maWxlBjsAVEkiTmh0dHBzOi8vYXBpLnNob3BpZnkuY29tL2F1dGgvcGFydG5lcnMuY29sbGFib3JhdG9yLXJlbGF0aW9uc2hpcHMucmVhZG9ubHkGOwBUSSIwaHR0cHM6Ly9hcGkuc2hvcGlmeS5jb20vYXV0aC9iYW5raW5nLm1hbmFnZQY7AFRJIkJodHRwczovL2FwaS5zaG9waWZ5LmNvbS9hdXRoL21lcmNoYW50LXNldHVwLWRhc2hib2FyZC5ncmFwaHFsBjsAVEkiPGh0dHBzOi8vYXBpLnNob3BpZnkuY29tL2F1dGgvc2hvcGlmeS1jaGF0LmFkbWluLmdyYXBocWwGOwBUSSI3aHR0cHM6Ly9hcGkuc2hvcGlmeS5jb20vYXV0aC9mbG93LndvcmtmbG93cy5tYW5hZ2UGOwBUSSI%2BaHR0cHM6Ly9hcGkuc2hvcGlmeS5jb20vYXV0aC9vcmdhbml6YXRpb24taWRlbnRpdHkubWFuYWdlBjsAVEkiPmh0dHBzOi8vYXBpLnNob3BpZnkuY29tL2F1dGgvbWVyY2hhbnQtYmFuay1hY2NvdW50Lm1hbmFnZQY7AFRJIg9jb25maWcta2V5BjsAVEkiDGRlZmF1bHQGOwBU--5a0b3ceab1bdca1f7c03e6234121fe86e314e1ab; identity-state-d62c067fbaf254e430a896b14bda18a2=BAh7DEkiDnJldHVybi10bwY6BkVUSSI5aHR0cHM6Ly9pZWgtdGVzdC0yMDIzLm15c2hvcGlmeS5jb20vYWRtaW4vYXV0aC9sb2dpbgY7AFRJIhFyZWRpcmVjdC11cmkGOwBUSSJFaHR0cHM6Ly9pZWgtdGVzdC0yMDIzLm15c2hvcGlmeS5jb20vYWRtaW4vYXV0aC9pZGVudGl0eS9jYWxsYmFjawY7AFRJIhBzZXNzaW9uLWtleQY7AFQ6DGFjY291bnRJIg9jcmVhdGVkLWF0BjsAVGYXMTY5NDc0ODcxNy44MDUwNDY2SSIKbm9uY2UGOwBUSSIlYjMwOGNiMjFlZWVhNGUyOTNjZDVlNzk3NDU4NmZhMmMGOwBGSSIKc2NvcGUGOwBUWxBJIgplbWFpbAY7AFRJIjdodHRwczovL2FwaS5zaG9waWZ5LmNvbS9hdXRoL2Rlc3RpbmF0aW9ucy5yZWFkb25seQY7AFRJIgtvcGVuaWQGOwBUSSIMcHJvZmlsZQY7AFRJIk5odHRwczovL2FwaS5zaG9waWZ5LmNvbS9hdXRoL3BhcnRuZXJzLmNvbGxhYm9yYXRvci1yZWxhdGlvbnNoaXBzLnJlYWRvbmx5BjsAVEkiMGh0dHBzOi8vYXBpLnNob3BpZnkuY29tL2F1dGgvYmFua2luZy5tYW5hZ2UGOwBUSSJCaHR0cHM6Ly9hcGkuc2hvcGlmeS5jb20vYXV0aC9tZXJjaGFudC1zZXR1cC1kYXNoYm9hcmQuZ3JhcGhxbAY7AFRJIjxodHRwczovL2FwaS5zaG9waWZ5LmNvbS9hdXRoL3Nob3BpZnktY2hhdC5hZG1pbi5ncmFwaHFsBjsAVEkiN2h0dHBzOi8vYXBpLnNob3BpZnkuY29tL2F1dGgvZmxvdy53b3JrZmxvd3MubWFuYWdlBjsAVEkiPmh0dHBzOi8vYXBpLnNob3BpZnkuY29tL2F1dGgvb3JnYW5pemF0aW9uLWlkZW50aXR5Lm1hbmFnZQY7AFRJIj5odHRwczovL2FwaS5zaG9waWZ5LmNvbS9hdXRoL21lcmNoYW50LWJhbmstYWNjb3VudC5tYW5hZ2UGOwBUSSIPY29uZmlnLWtleQY7AFRJIgxkZWZhdWx0BjsAVA%3D%3D--181ab3909508e5c7e048ae0d45c15497a9db8512',
            }
        }

        getCustomer({ email, phone }) {
            const query = encodeURIComponent(`email:${email} AND phone:${phone}`)
            return https.get({
                url: this._baseURL + `/admin/api/2021-07/customers/search.json?query=${query}`,
                headers: this._headers,
            })
        }

        deleteCustomer(customerId, customerPhone, customerEmail, nsCustomerID) {
            //ONLY REMOVING TAGS ON SHOPIFY
            return https.put({
                url: this._baseURL + `/admin/api/2021-07/customers/${customerId}.json`,
                headers: this._headers,

                body: JSON.stringify({
                    "customer": {
                        id: customerId,
                        tags: `WVProxyCustomerId_${nsCustomerID}, Code_86, Phone_${customerPhone} `
                    }
                })
            })
        }
    }

    return ShopifyServices
})
