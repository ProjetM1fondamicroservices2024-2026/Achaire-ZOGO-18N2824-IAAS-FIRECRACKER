import axios from 'axios';

const SERVICE_NAME = 'SERVICE-VM-OFFER/api';


export const getVmOffers = async()=>{

    const res = await axios.get(`/${SERVICE_NAME}/vm-offers/`).catch((err)=>console.log(err));

     if (res.status !== 200){
        return console.log(`Failed to fetch vm offers error code ${res.status}`);
    }
    console.log(res);
    const resData = await res.data;

    return resData.data.data.vm_offers;
}


export const createVmOffer = async(data)=>{

    const res = await axios.post(`/${SERVICE_NAME}/vm-offers/`,
        {
            name: data.name,
            description: data.description,
            cpu_count: data.cpu_count,
            memory_size_mib: data.memory_size_mib,
            disk_size_gb: data.disk_size_gb,
            price_per_hour: data.price_per_hour

        }
    ).catch((err)=>console.log(err));

     if (res.status !== 201){
        return console.log(`Failed to create vm offer error code ${res.status}`);
    }

    const resData = await res.data;

    return resData;
}



export const getVmOfferById = async(vm_offer_id)=>{

    const res = await axios.get(`/${SERVICE_NAME}/vm-offers/${vm_offer_id}`).catch((err)=>console.log(err));

     if (res.status !== 200){
        return console.log(`Failed to fetch vm offer ${vm_offer_id} error code ${res.status}`);
    }

    const resData = await res.data;

    return resData;
}



export const deleteVmOffer = async(vm_offer_id)=>{

    const res = await axios.delete(`/${SERVICE_NAME}/vm-offers/${vm_offer_id}`).catch((err)=>console.log(err));

     if (res.status !== 200){
        return console.log(`Failed to delete vm offer ${vm_offer_id} error code ${res.status}`);
    }

    const resData = await res.data;

    return resData;
}



export const updateVmOffer = async(vm_offer_id,data)=>{

    const res = await axios.put(`/${SERVICE_NAME}/vm-offers/${vm_offer_id}`,
        {
            name: data.name,
            description: data.description,
            cpu_count: data.cpu_count,
            memory_size_mib: data.memory_size_mib,
            disk_size_mib: data.disk_size_mib,
            price_per_hour: data.price_per_hour
        }
    ).catch((err)=>console.log(err));

     if (res.status !== 200){
        return console.log(`Failed to update vm offer ${vm_offer_id} error code ${res.status}`);
    }

    const resData = await res.data;

    return resData;
}


export const searchVmOffer = async(name)=>{

    const res = await axios.post(`/${SERVICE_NAME}/vm-offers/search/${name}`)
    .catch((err)=>console.log(err));


    if (res.status !== 200){
        return console.log(`Failed to get vm offer ${name} error code ${res.status}`);
    }

    const resData = await res.data;

    return resData;

}


export const getActiveVmOffers = async()=>{

    const res = await axios.get(`/${SERVICE_NAME}/vm-offers/active`).catch((err)=>console.log(err));
     
    console.log(res.data.data.data);
     if (res.status !== 200){
        return console.log(`Failed to fetch active vm offers error code ${res.status}`);
    }

    const resData = await res.data;

    return resData.data.data.offers;
}



export const getVmOfferHealthCheck = async()=>{
     const res = await axios.get(`/${SERVICE_NAME}/service-vm-offer/health`).
     catch((err)=>console.log(err));


    if (res.status !== 200){
        return console.log(`Failed to check vm offers service health error code ${res.status}`);
    }

    const resData = await res.data;

    return resData;
}











