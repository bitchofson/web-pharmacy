import axios from "axios";
import React, { useEffect, useState } from "react";

export default function Availability() {
  
  // content
  const [tableData, setTableData] = useState([]);
  // availability
  const [availability, setAvailability] = useState([]);
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
    "Кол-во",
    "Цена",
    "Название препарата",
    "Аптеки",
    "Редактировать",
    "Удалить"
  ]);

  const [drugs, setDrugs] = useState([]);

  const [pharmacys, setPharmacys] = useState([]);

  const [currentPharmacy, setCurrentPharmacy] = useState([]);

  const fetchPharmacys = async () => {
    const response = await axios.get(`http://localhost:8000/api/v1/pharmacy/?size=50`);
    return setPharmacys(response.data.items);
  };

  const fetchDrugs = async () => {
    const response = await axios.get(`http://localhost:8000/api/v1/drug/?size=50`);
    return setDrugs(response.data.items);
  };

  const fetchAvailability = async (id) => {
    const response = await axios.get(`http://localhost:8000/api/v1/availability/${id}`);
    return setAvailability(response.data);
  };

  // default page option
  const [pageOption] = useState([5, 10, 20]);
  
  const fetchAvailabilitys = async() => {
    axios.get("http://localhost:8000/api/v1/availability/?size=5").then((response) => {
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
    fetchAvailabilitys();
    fetchDrugs();
    fetchPharmacys();
  }, []);

  // capitalize first letter
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  // modifiedTable td
  const tdTable = (data) => {

    const td_list=[];

    for (const [key, value] of Object.entries(data)) {
      if (key === 'id') {
        continue;
      } else if(key === 'pharmacy') {

        const list_pharmacy = [];

        if (value.length > 0) {
            value.map((element) => {
                list_pharmacy.push(element.name + '-' + element.adress);
                list_pharmacy.push(', ')
            })
            list_pharmacy.pop();
        } else {
            list_pharmacy.push('-');
        }

        td_list.push(<td>{list_pharmacy}</td>);

      } else if (key === "drug") {
        for (const [key_inner, value_inner] of Object.entries(value)) {
          if (key_inner === 'name') {
          td_list.push(<td key={key_inner}>{capitalizeFirstLetter(value_inner)}</td>);
          }
        }
      }  else {
        td_list.push(<td key={key}>{value}</td>);
    }
  }

  td_list.push(<td><button 
    onClick={() => {
        fetchAvailability(data.id);
    }}
    className="btn btn-base-200 text-gray hover:text-white">Редактировать</button></td>);

  td_list.push(<td><button 
    onClick={() => {
        deleteAvailability(data.id);
    }}
    className="btn btn-base-200 text-gray hover:text-white">Удалить</button></td>);

    return td_list;
  };

  // onClick delete selected
  const deleteAvailability = async (id) => {
    await axios.delete(`http://localhost:8000/api/v1/availability/${id}`);
    renderPagination(pageNumber);
  };

   // onClick edit selected
   const createOrEditAvailability = async () => {
      if (availability.id) {
        await axios.patch(`http://localhost:8000/api/v1/availability/${availability.id}`, availability)
      } else {
        if (availability.quantity != null && availability.price && availability.drug_id != null) {
          await axios.post(`http://localhost:8000/api/v1/availability/`, availability)
        }
      }
      renderPagination(1);
  };

  // onClick render pagination
  const renderPagination = async (page) => {
    const url = `http://localhost:8000/api/v1/availability/?page=${page}&size=${pageSize}`
    
    axios.get(url).then((response) => {
    //   // remove key id
    //   response.data.items.forEach((element) => {
    //     delete element.manufacturer['id'];
    //     delete element.release_form['id'];
    //   });

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
    const url = `http://localhost:8000/api/v1/availability/?page=${pageNumber}&size=${pageSize}`
    
    axios.get(url).then((response) => {
      console.log(response)
    //   // remove key id
    //   response.data.items.forEach((element) => {
    //     delete element.manufacturer['id'];
    //     delete element.release_form['id'];
    //   });

      setTableData(response.data.items)
      setPageNumber(response.data.page)
      setPageSize(response.data.size)
      setTotalPages(response.data.pages)
      setTotalRecord(response.data.total)

      }).catch((error) => {
        console.log(error)
      })
  };

  const addPharmacyInAvailability = async () => {
    if (availability.id) {
      await axios.post(`http://localhost:8000/api/v1/availability/${availability.id}/pharmacy/${currentPharmacy}`, availability.id, currentPharmacy)
      renderPagination(1);
    }
  };

  const deletePharmacyFromAvailability = async () => {
    if (availability.id) {
      await axios.delete(`http://localhost:8000/api/v1/availability/${availability.id}/pharmacy/${currentPharmacy}`, availability.id, currentPharmacy)
      renderPagination(1);
    }
  };

 // clear all 
 const clearAll = () => {
  availability.id = null
  availability.price = null
  availability.quantity = null
  document.getElementById('queryInput').value = '';
  document.getElementById('priceInput').value = '';
};

const onSearchHandler = async (data) => {
  const filter = `price*${data}`
  setFilteredColumn(filter)
  let url = `http://localhost:8000/api/v1/availability/?&page=${pageNumber}&size=${pageSize}&filter=${filter}`
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
            placeholder="Поиск по цене"
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
          id="queryInput"
          placeholder="Кол-во"
          value={availability.quantity}
          onChange={(e) => setAvailability({...availability, quantity:e.target.value})}
          />

          <input
          type="text"
          className="input input-bordered input-base-200"
          id="priceInput"
          placeholder="Цена"
          value={availability.price}
          onChange={(e) => setAvailability({...availability, price:e.target.value})}
          />

          <select 
            className="select select-bordered max-w-xs my-4"
            onChange={(e) => {
              setAvailability({...availability, drug_id:e.target.value})
            }}
            >
            {drugs.map((data, index) => {
              return (<option key={index} value={data.id}>{data.name}</option>)
            })}
          </select>

          <button 
            onClick={() => {
                createOrEditAvailability()
                clearAll()
            }}
            className="btn btn-base-200 text-gray hover:text-white">Отправить</button>

        </div>

        {/* add or delete pharmacy*/}
        <div>
        <select 
            className="select select-bordered max-w-xs my-4"
            onChange={(e) => {
              setCurrentPharmacy(e.target.value);
            }}
            >
            {pharmacys.map((data, index) => {
              return (<option key={index} value={data.id}>{data.name} -{data.adress}</option>)
            })}
          </select>

          <button 
            onClick={() => {
                addPharmacyInAvailability();
            }}
            className="btn btn-base-200 text-gray hover:text-white">Добавить</button>

            <button 
            onClick={() => {
                deletePharmacyFromAvailability();
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