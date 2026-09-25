export const fetchApi = async(pathname: string ,data: object, token?: string) =>{
const domain =  window.location.origin
const fetching = await fetch(domain + '/api/' + pathname, {
        method: "POST",
        headers:{
            accept: "application/json",
            "Content-type": "application/json",
            'Access-Control-Allow-Origin': domain,
            Authorization: `Bearer ${token}`
        },
        //mode: "no-cors",
        body: JSON.stringify(data)
    })
    const res = await fetching.json()
    if(fetching.status !== 200){
        window.location.pathname = '/login'
        localStorage.clear()
        return {status: fetching.status , ...res}
    }else{
        return {status: fetching.status , ...res}
    }

}