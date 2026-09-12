const domain = 'http://192.168.254.108:3001/'
export const fetchApi = async(pathname: string ,data: object, token?: string) =>{
const fetching = await fetch(domain + 'api/' + pathname, {
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
        setTimeout(() => { 
            window.location.pathname = '/login'
            localStorage.clear()
         }, 2000);
        return {status: fetching.status , ...res}
    }else{
        return {status: fetching.status , ...res}
    }

}