import axios from "axios";
import React, { useEffect, useState } from "react";

export default function Manufacturer() {
  
  // content
  const [tableData, setTableData] = useState([]);
  // release form
  const [manufacturer, setManufacturer] = useState([]);
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
    "Имя",
    "Адрес производства",
    "Редактировать",
    "Удалить"
  ]);

  // default page option
  const [pageOption] = useState([5, 10, 20]);
  
  const fetchManufacturers = async() => {
    axios.get("http://localhost:8000/api/v1/manufacturer/?size=5").then((response) => {
      
      setTableData(response.data.items)
      setPageNumber(response.data.page)
      setPageSize(response.data.size)
      setTotalPages(response.data.pages)
      setTotalRecord(response.data.total)

      }).catch((error) => {
        console.log(error)
      })
  };

  const fetchManufacturer = async (id) => {
    const response = await axios.get(`http://localhost:8000/api/v1/manufacturer/${id}`);
    return setManufacturer(response.data);
  }


  useEffect(() => {
    fetchManufacturers();
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
      } else {
        td_list.push(<td key={key}>{capitalizeFirstLetter(value)}</td>);
    }
  }

  td_list.push(<td><button 
    onClick={() => {
      fetchManufacturer(data.id);
    }}
    className="btn btn-base-200 text-gray hover:text-white">Редактировать</button></td>);

  td_list.push(<td><button 
    onClick={() => {
        deleteManufacturer(data.id);
    }}
    className="btn btn-base-200 text-gray hover:text-white">Удалить</button></td>);

    return td_list;
  };

  // onClick delete selected
  const deleteManufacturer= async (id) => {
    await axios.delete(`http://localhost:8000/api/v1/manufacturer/${id}`);
    renderPagination(pageNumber);
  };

   // onClick edit selected
   const createOrEditManufacturer = async () => {
      if (manufacturer.id) {
        await axios.patch(`http://localhost:8000/api/v1/manufacturer/${manufacturer.id}`, manufacturer)
      } else {
        if (manufacturer.name != null && manufacturer.adress != null) {
          await axios.post(`http://localhost:8000/api/v1/manufacturer/`, manufacturer)
        }
      }
      renderPagination(1);
  };

  // onClick render pagination
  const renderPagination = async (page) => {
    const url = `http://localhost:8000/api/v1/manufacturer/?page=${page}&size=${pageSize}`
    
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
    const url = `http://localhost:8000/api/v1/manufacturer/?page=${pageNumber}&size=${pageSize}`
    
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

    // clear all 
 const clearAll = () => {
  manufacturer.id = null
  manufacturer.name = null
  manufacturer.adress = null
  document.getElementById('nameInput').value = '';
  document.getElementById('adressInput').value = '';
};

const onSearchHandler = async (data) => {
  const filter = `name*${data}-adress*${data}`
  setFilteredColumn(filter)
  let url = `http://localhost:8000/api/v1/manufacturer/?&page=${pageNumber}&size=${pageSize}&filter=${filter}`
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

        {/* create release form*/}
        <div>
          <input
          type="text"
          className="input input-bordered input-base-200"
          placeholder="Имя"
          id="nameInput"
          value={manufacturer.name}
          onChange={(e) => setManufacturer({...manufacturer, name:e.target.value})}
          />

          <input
          type="text"
          className="input input-bordered input-base-200"
          placeholder="Адрес производства"
          id="adressInput"
          value={manufacturer.adress}
          onChange={(e) => setManufacturer({...manufacturer, adress:e.target.value})}
          />

          <button 
            onClick={() => {
              createOrEditManufacturer()
              clearAll()
            }}
            className="btn btn-base-200 text-gray hover:text-white">Отправить</button>

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