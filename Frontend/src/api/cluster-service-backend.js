import axios from 'axios';

const SERVICE_NAME = 'SERVICE-CLUSTER';

export const getHealthCheck = async()=>{
     const res = await axios.get(`/${SERVICE_NAME}/api/service-clusters/health`).
     catch((err)=>console.log(err));


    if (res.status !== 200){
        return console.log(`Failed to check cluster health error code ${res.status}`);
    }

    const resData = await res.data;

    return resData;
}



export const getInfo = async()=>{
     const res = await axios.get(`/${SERVICE_NAME}/api/service-clusters/info`).
     catch((err)=>console.log(err));


    if (res.status !== 200){
        return console.log(`Failed to check cluster info error code ${res.status}`);
    }

    const resData = await res.data;

    return resData;
}




export const getClusters = async()=>{
     const res = await axios.get(`/${SERVICE_NAME}/api/service-clusters/`).
     catch((err)=>console.log(err));


    if (res.status !== 200){
        return console.log(`Failed to fetch clusters error code ${res.status}`);
    }

    const resData = await res.data;
    console.log(resData);

    return resData.data.data.clusters;
}



export const getClusterById = async(cluster_id)=>{
     const res = await axios.get(`/${SERVICE_NAME}/api/service-clusters/${cluster_id}`).
     catch((err)=>console.log(err));


    if (res.status !== 200){
        return console.log(`Failed to fetch cluster ${cluster_id} error code ${res.status}`);
    }

    const resData = await res.data;

    return resData;
}



export const getAvailableClusters = async()=>{
     const res = await axios.get(`/${SERVICE_NAME}/api/service-clusters`).
     catch((err)=>console.log(err));


    if (res.status !== 200){
        return console.log(`Failed to fetch available clusters error code ${res.status}`);
    }

    const resData = await res.data;
     console.log(resData.data.data.clusters);

    return resData.data.data.clusters;
}



export const createCluster = async(data)=>{
     const res = await axios.post(`/${SERVICE_NAME}/api/service-clusters/`,
        {
            nom: data.nom,
            adresse_mac: data.adresse_mac,
            ip: data.ip,
            rom: data.rom,
            available_rom: data.available_rom,
            ram: data.ram,
            available_ram: data.available_ram,
            processeur: data.processeur,
            available_processor: data.available_processor,
            number_of_core: data.number_of_core 

        }
     ).
     catch((err)=>console.log(err));


    if (res.status !== 201){
        return console.log(`Failed to create cluster  error code ${res.status}`);
    }

    const resData = await res.data;

    return resData;
}



export const updateCluster = async(data,cluster_id)=>{
     const res = await axios.patch(`/${SERVICE_NAME}/api/service-clusters/${cluster_id}`,
        {
            nom: data.nom,
            adresse_mac: data.adresse_mac,
            ip: data.ip,
            rom: data.rom,
            available_rom: data.available_rom,
            ram: data.ram,
            available_ram: data.available_ram,
            processeur: data.processeur,
            available_processor: data.available_processor,
            number_of_core: data.number_of_core 

        }
     ).
     catch((err)=>console.log(err));


    if (res.status !== 200){
        return console.log(`Failed to update cluster ${cluster_id}  error code ${res.status}`);
    }

    const resData = await res.data;

    return resData;
}


export const deleteCluster = async(cluster_id)=>{

    const res = await axios.delete(`/${SERVICE_NAME}/api/service-clusters/${cluster_id}`).
     catch((err)=>console.log(err));


     if (res.status !== 200){
        return console.log(`Failed to delete cluster ${cluster_id}  error code ${res.status}`);
    }

    const resData = await res.data;

    return resData;
}





export const findSuitableHost = async(data)=>{
    console.log( {
            cpu_count: data.cpu_count,
            memory_size_mib: data.memory_size_mib,
            disk_size_gb: data.disk_size_gb,
            name: data.name,
            user_id: data.user_id,
            os_type: data.os_type,
            root_password: data.root_password,
            vm_offer_id: data.vm_offer_id,
            system_image_id: data.system_image_id
        });
     const res = await axios.post(`/${SERVICE_NAME}/api/service-clusters/find-suitable-host`,
        {
            cpu_count: data.cpu_count,
            memory_size_mib: data.memory_size_mib,
            disk_size_gb: data.disk_size_gb,
            name: data.name,
            user_id: `${data.user_id}`,
            os_type: data.os_type,
            root_password: data.root_password,
            vm_offer_id: `${data.vm_offer_id}`,
            system_image_id: `${data.system_image_id}`
        }


      
     ).
     catch((err)=>console.log(err));


    if (res.status !== 200){
        return console.log(`Failed to fetch suitable hosts error code ${res.status}`);
    }

    const resData = await res.data;
    console.log(resData);
    return resData;
}


