import axios from "axios";
import React, { useEffect, useState } from "react";

export default function ReleaseForm() {
  
  // content
  const [tableData, setTableData] = useState([]);
  // release form
  const [release_form, setReleaseForm] = useState([]);
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
    "Форма выпуска",
    "Редактировать",
    "Удалить"
  ]);

  // default page option
  const [pageOption] = useState([5, 10, 20]);
  
  const fetchReleaseForms = async() => {
    axios.get("http://localhost:8000/api/v1/release-form/?size=5").then((response) => {
      
      setTableData(response.data.items)
      setPageNumber(response.data.page)
      setPageSize(response.data.size)
      setTotalPages(response.data.pages)
      setTotalRecord(response.data.total)

      }).catch((error) => {
        console.log(error)
      })
  };

  const fetchReleaseForm = async (id) => {
    const response = await axios.get(`http://localhost:8000/api/v1/release-form/${id}`);
    return setReleaseForm(response.data);
  }


  useEffect(() => {
      fetchReleaseForms();
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
      fetchReleaseForm(data.id);
    }}
    className="btn btn-base-200 text-gray hover:text-white">Редактировать</button></td>);

  td_list.push(<td><button 
    onClick={() => {
        deleteReleaseForm(data.id);
    }}
    className="btn btn-base-200 text-gray hover:text-white">Удалить</button></td>);

    return td_list;
  };

  // onClick delete selected
  const deleteReleaseForm = async (id) => {
    await axios.delete(`http://localhost:8000/api/v1/release-form/${id}`);
    renderPagination(pageNumber);
  };

   // onClick edit selected
   const createOrEditReleaseForm = async () => {
    
      if (release_form.id) {
        await axios.patch(`http://localhost:8000/api/v1/release-form/${release_form.id}`, release_form)
      } else {
        if (release_form.form != null) {
          await axios.post(`http://localhost:8000/api/v1/release-form/`, release_form)
        }
      }
      renderPagination(1);
  };

  // onClick render pagination
  const renderPagination = async (page) => {
    const url = `http://localhost:8000/api/v1/release-form/?page=${page}&size=${pageSize}`
    
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
    const url = `http://localhost:8000/api/v1/release-form/?page=${pageNumber}&size=${pageSize}`
    
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
    release_form.id = null
    release_form.form = null
    document.getElementById('formInput').value = '';
  };

const onSearchHandler = async (data) => {
    const filter = `form*${data}`
    setFilteredColumn(filter)
    let url = `http://localhost:8000/api/v1/release-form/?&page=${pageNumber}&size=${pageSize}&filter=${filter}`
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
          id="formInput"
          value={release_form.form}
          onChange={(e) => setReleaseForm({...release_form, form:e.target.value})}
          />

          <button 
            onClick={() => {
              createOrEditReleaseForm()
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