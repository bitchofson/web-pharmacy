import axios from "axios";
import React, { useEffect, useState } from "react";
import Create from './components/create';

export default function App() {
  
  // content
  const [tableData, setTableData] = useState([]);
  // page_number
  const [pageNumber, setPageNumber] = useState([]);
  // page_size
  const [pageSize, setPageSize] = useState([]);
  // total_pages
  const [totalPages, setTotalPages] = useState([]);
  // totat_record
  const [totalRecord, setTotalRecord] = useState([]);

  // table head
  const [tableHead] = useState([
    "Номер",
    "Название",
    "Описание",
    "Рецепт",
    "Форма выпуска",
    "Производитель",
    "Адресс производства"
  ]);

  // default page option
  const [pageOption] = useState([5, 10, 20]);

  useEffect(() => {
      axios.get("http://localhost:8000/api/v1/drug/?size=5").then((response) => {
      console.log(response)
      // remove key id
      response.data.items.forEach((element) => {
        delete element.manufacturer['id'];
        delete element.release_form['id'];
      });

      setTableData(response.data.items)
      setPageNumber(response.data.page)
      setPageSize(response.data.size)
      setTotalPages(response.data.pages)
      setTotalRecord(response.data.total)

      }).catch((error) => {
        console.log(error)
      })
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
      } else if (key === "release_form") {
        // release_form is an object, so we need to drill down into it
        for (const [key_inner, value_inner] of Object.entries(value)) {
          td_list.push(<td key={key_inner}>{capitalizeFirstLetter(value_inner)}</td>);
        }
      } else if (key === "manufacturer") {
        // manufacturer is an object, so we need to drill down into it
        for (const [key_inner, value_inner] of Object.entries(value)) {
          td_list.push(<td key={key_inner}>{capitalizeFirstLetter(value_inner)}</td>);
        }
      } else {
        td_list.push(<td key={key}>{capitalizeFirstLetter(value)}</td>);
      }
    }

    return td_list;
  };


  // onClick render pagination
  const renderPagination = async (page) => {
    const url = `http://localhost:8000/api/v1/drug/?page=${page}&size=${pageSize}`
    
    axios.get(url).then((response) => {
      // remove key id
      response.data.items.forEach((element) => {
        delete element.manufacturer['id'];
        delete element.release_form['id'];
      });

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
    const url = `http://localhost:8000/api/v1/drug/?page=${pageNumber}&size=${pageSize}`
    
    axios.get(url).then((response) => {
      console.log(response)
      // remove key id
      response.data.items.forEach((element) => {
        delete element.manufacturer['id'];
        delete element.release_form['id'];
      });

      setTableData(response.data.items)
      setPageNumber(response.data.page)
      setPageSize(response.data.size)
      setTotalPages(response.data.pages)
      setTotalRecord(response.data.total)

      }).catch((error) => {
        console.log(error)
      })
  };

  return <React.Fragment>
    <div className="md:px-32 py-8-w-full">

    {/* header */}
    <div className="w-max relative my-5">
      {/* select page */}
      <select 
      className="select select-bordered max-w-xs my-4" 
      defaultValue={pageSize} 
      onChange={(e) =>{
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
      
      </div>
        <Create/>
      <div>

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
                    <td>{index + 1}</td>
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
          <p>Страница {pageNumber} из {totalPages}. Всего {totalRecord} записей.</p>
        </div>
      </div>

    </div>
  </React.Fragment>
}