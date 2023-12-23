import axios from "axios";
import React, { useEffect, useState } from "react";

export default function Pharmacy() {
  
  // content
  const [tableData, setTableData] = useState([]);
  // pharmacy
  const [pharmacy, setPharmacy] = useState([]);
  // page_number
  const [pageNumber, setPageNumber] = useState([]);
  // page_size
  const [pageSize, setPageSize] = useState([]);
  // total_pages
  const [totalPages, setTotalPages] = useState([]);
  // totat_record
  const [totalRecord, setTotalRecord] = useState([]);
   // filtered column
   const [filteredColumn, setFilteredColumn] = useState(null);

  // table head
  const [tableHead] = useState([
    "Название",
    "Адрес",
    "Время работы",
    "Препараты в наличии",
    "Редактировать",
    "Удалить"
  ]);

  const [availabilitys, setAvailabilitys] = useState([]);


  const [currentAvailability, setCurrentAvailability] = useState([]);

  const fetchAvailabilitys = async () => {
    const response = await axios.get(`http://localhost:8000/api/v1/availability/?size=50`);
    return setAvailabilitys(response.data.items);
  };

  const fetchPharmacy = async (id) => {
    const response = await axios.get(`http://localhost:8000/api/v1/pharmacy/${id}`);
    return setPharmacy(response.data);
  };
  
  // default page option
  const [pageOption] = useState([5, 10, 20]);
  
  const fetchPharmacys = async() => {
    axios.get("http://localhost:8000/api/v1/pharmacy/?size=5").then((response) => {
      setTableData(response.data.items)
      setPageNumber(response.data.page)
      setPageSize(response.data.size)
      setTotalPages(response.data.pages)
      setTotalRecord(response.data.total)

      }).catch((error) => {
        console.log(error)
      })
  };

  useEffect(() => {
    fetchPharmacys();
    fetchAvailabilitys();
  }, []);

  // modifiedTable td
  const tdTable = (data) => {

    const td_list=[];

    for (const [key, value] of Object.entries(data)) {
      if (key === 'id') {
        continue;
      } else if (key === "availability") {
        if (value.length > 0) {
            const list_availability = [];
            for (const [key_inner, value_inner] of Object.entries(value)) {
                list_availability.push(value_inner.drug['name']+ '-' + value_inner.quantity + '-' + value_inner.price);
                list_availability.push(', ');
            }
            list_availability.pop();
            td_list.push(<td>{list_availability}</td>);
        } else {
            td_list.push(<td>-</td>);
        }
       
      }  else {
        td_list.push(<td key={key}>{value}</td>);
    }
  }

  td_list.push(<td><button 
    onClick={() => {
        fetchPharmacy(data.id);
    }}
    className="btn btn-base-200 text-gray hover:text-white">Редактировать</button></td>);

  td_list.push(<td><button 
    onClick={() => {
        deletePharmacy(data.id);
    }}
    className="btn btn-base-200 text-gray hover:text-white">Удалить</button></td>);

    return td_list;
  };

  // onClick delete selected
  const deletePharmacy = async (id) => {
    await axios.delete(`http://localhost:8000/api/v1/pharmacy/${id}`);
    renderPagination(pageNumber);
  };

   // onClick edit selected
   const createOrEditPharmacy = async () => {
      if (pharmacy.id) {
        await axios.patch(`http://localhost:8000/api/v1/pharmacy/${pharmacy.id}`, pharmacy)
      } else {
        if (pharmacy.name != null && pharmacy.adress != null && pharmacy.opening != null) {
        await axios.post(`http://localhost:8000/api/v1/pharmacy/`, pharmacy)
        }
      }
      renderPagination(1);
  };

  // onClick render pagination
  const renderPagination = async (page) => {
    const url = `http://localhost:8000/api/v1/pharmacy/?page=${page}&size=${pageSize}`
    
    axios.get(url).then((response) => {
      setTableData(response.data.items)
      setPageNumber(response.data.page)
      setPageSize(response.data.size)
      setTotalPages(response.data.pages)
      setTotalRecord(response.data.total)

      }).catch((error) => {
        console.log(error)
      })

  };

  // pagination
  const pageRows = () => {
    const rows = [];
    for (let index = 1; index <= totalPages; index++) {
      rows.push(
      <button 
        onClick={() => {
          renderPagination(index)
        }}
        className={`btn ${pageNumber === index ? "bg-neutral" : "btn-base-200 text-black hover:text-white"}`}
        key={index}>
          {index}
      </button>)
    }
    return rows;
  };

  // change page option
  const onChangePageLimit = async (pageSize) => {
    const url = `http://localhost:8000/api/v1/pharmacy/?page=${pageNumber}&size=${pageSize}`
    
    axios.get(url).then((response) => {
      console.log(response)

      setTableData(response.data.items)
      setPageNumber(response.data.page)
      setPageSize(response.data.size)
      setTotalPages(response.data.pages)
      setTotalRecord(response.data.total)

      }).catch((error) => {
        console.log(error)
      })
  };

  const addAvailabilityInPharmacy = async () => {
    if (pharmacy.id) {
      await axios.post(`http://localhost:8000/api/v1/pharmacy/${pharmacy.id}/availability/${currentAvailability}`, pharmacy.id, currentAvailability)
      renderPagination(1);
    }
  };

  const deleteAvailabilityFromPharmacy = async () => {
    if (pharmacy.id) {
      await axios.delete(`http://localhost:8000/api/v1/pharmacy/${pharmacy.id}/availability/${currentAvailability}`, pharmacy.id, currentAvailability)
      renderPagination(1);
    }
  };

   // clear all 
 const clearAll = () => {
  pharmacy.id = null
  pharmacy.name = null
  pharmacy.adress = null
  pharmacy.opening = null
  document.getElementById('workHoursInput').value = '';
  document.getElementById('nameInput').value = '';
  document.getElementById('adressInput').value = '';
};

const onSearchHandler = async (data) => {
  const filter = `name*${data}-adress*${data}-opening*${data}`
  setFilteredColumn(filter)
  let url = `http://localhost:8000/api/v1/pharmacy/?&page=${pageNumber}&size=${pageSize}&filter=${filter}`
  await axios.get(url).then((response) => {
    
    setTableData(response.data.items)
    setPageNumber(response.data.page)
    setPageSize(response.data.size)
    setTotalPages(response.data.pages)
    setTotalRecord(response.data.total)

    }).catch((error) => {
      console.log(error)
    });
};

  return <React.Fragment>
    <div className="md:px-32 py-8-w-full">

      {/* header */}
      <div className="w-max relative my-5">

        {/* Search */}
        <input
            type="text"
            placeholder="Поиск"
            className="input input-bordered input-base-200 max-w-xs"
            onChange={(e)=>{
              onSearchHandler(e.target.value)
            }}
          />
        {/* select page */}
        <select 
          className="select select-bordered max-w-xs my-4" 
          defaultValue={pageSize} 
          onChange={(e) =>{
            console.log(e.target.value)
            onChangePageLimit(e.target.value)
          }}>
            {pageOption.map((data, index) => {
              if (data === pageSize) {
                return (<option className="bg-gray-200" key={index} value={data} selected disabled>
                Кол-во записей {data}</option>)
              } else {
                return (<option key={index} value={data}>
                Кол-во записей {data}</option>)
              }
          })}
        </select>

        {/* create or edit availability*/}
        <div>
          <input
          type="text"
          className="input input-bordered input-base-200"
          placeholder="Имя"
          id="nameInput"
          value={pharmacy.name}
          onChange={(e) => setPharmacy({...pharmacy, name:e.target.value})}
          />

          <input
          type="text"
          className="input input-bordered input-base-200"
          placeholder="Адрес"
          id="adressInput"
          value={pharmacy.adress}
          onChange={(e) => setPharmacy({...pharmacy, adress:e.target.value})}
          />

          <input
          type="text"
          className="input input-bordered input-base-200"
          placeholder="Часы работы"
          id="workHoursInput"
          value={pharmacy.opening}
          onChange={(e) => setPharmacy({...pharmacy, opening:e.target.value})}
          />

          <button 
            onClick={() => {
                createOrEditPharmacy();
                clearAll();
            }}
            className="btn btn-base-200 text-gray hover:text-white">Отправить</button>

        </div>

        {/* add or delete availability*/}
         <div>
         <select 
            className="select select-bordered max-w-xs my-4"
            onChange={(e) => {
              setCurrentAvailability(e.target.value);
            }}
            >
            {availabilitys.map((data, index) => {
              return (<option key={index} value={data.id}>{data.drug['name']}-{data.quantity}-{data.price}</option>)
            })}
          </select>

          <button 
            onClick={() => {
                addAvailabilityInPharmacy();
                clearAll();
            }}
            className="btn btn-base-200 text-gray hover:text-white">Добавить</button>

            <button 
            onClick={() => {
                deleteAvailabilityFromPharmacy();
                clearAll();
            }}
            className="btn btn-base-200 text-gray hover:text-white">Удалить</button>
        </div>


      </div>

      {/* main table */}
      <div className="shadow overflow-hidden rounded border-b border-gray-200">
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                {tableHead.map((data,index)=>{
                  return(
                    <th className="cursor-pointer" key={index}>{data}</th>
                  )
                })}
              </tr>
            </thead>
            <tbody>
              {tableData.map((data, index) =>{
                return(
                  <tr key={index}>
                    {tdTable(data)}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* footer */}
      <div className="flex justify-between my-5">
        <div className="btn-group">
          {pageRows()}
        </div>
        <div className="content-center">
          <p>Страница {pageNumber} из {totalPages}. Всего записей {totalRecord}.</p>
        </div>
      </div>

    </div>
  </React.Fragment>
}