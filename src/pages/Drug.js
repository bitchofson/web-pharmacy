import axios from "axios";
import React, { useEffect, useState } from "react";

export default function Drug() {

  // content
  const [tableData, setTableData] = useState([]);
  // drug
  const [drug, SetDrug] = useState([]);
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

  const [haveReception, setHaveReception] = useState();

  const [notHaveReception, setNotHaveReception] = useState();


  // table head
  const [tableHead] = useState([
    "Название",
    "Описание",
    "Рецепт",
    "Форма выпуска",
    "Производитель",
    "Адресс производства",
    "Редактировать",
    "Удалить"
  ]);

  // default page option
  const [pageOption] = useState([5, 10, 20]);

  // default recipe option
  const [recipeOption] = useState(["По рецепту", "Без рецепта"]);

  // manufacturers
  const [manufacturers, setManufacturers] = useState([]);

  // release_forms
  const [release_forms, setReleaseForms] = useState([]);
  
  const fetchDrugs = async() => {
    axios.get("http://localhost:8000/api/v1/drug/?size=5").then((response) => {
      setTableData(response.data.items)
      setPageNumber(response.data.page)
      setPageSize(response.data.size)
      setTotalPages(response.data.pages)
      setTotalRecord(response.data.total)

      }).catch((error) => {
        console.log(error)
      })
  };

  const fetchManufacturers = async () => {
    const response = await axios.get(`http://localhost:8000/api/v1/manufacturer/?size=50`);
    return setManufacturers(response.data.items);
  }

  const fetchDrug = async (id) => {
    const response = await axios.get(`http://localhost:8000/api/v1/drug/${id}`);
    return SetDrug(response.data);
  }

  const fetchReleaseForms = async () => {
    const response = await axios.get(`http://localhost:8000/api/v1/release-form/?size=50`);
    return setReleaseForms(response.data.items);
  }

  const fetchStatistics = async () => {
    const response = await axios.get(`http://localhost:8000/api/v1/drug/count-reception`);
    for (const [key, value] of Object.entries(response.data)) {
      for (var k in value) {
          if (k === 'reception_no') {
            setNotHaveReception(value[k])
          } else if(k === 'reception_yes') {
            setHaveReception(value[k])
          }
      }
    }
  };

  useEffect(() => {
      fetchDrugs();
      fetchStatistics();
      fetchManufacturers();
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
      } else if (key === "release_form") {
        // release_form is an object, so we need to drill down into it
        for (const [key_inner, value_inner] of Object.entries(value)) {
          if (key_inner !== 'id') {
          td_list.push(<td key={key_inner}>{capitalizeFirstLetter(value_inner)}</td>);
          }
        }
      } else if (key === "manufacturer") {
        // manufacturer is an object, so we need to drill down into it
        for (const [key_inner, value_inner] of Object.entries(value)) {
          if (key_inner !== 'id') {
          td_list.push(<td key={key_inner}>{capitalizeFirstLetter(value_inner)}</td>);
          }
        }
      } else {
        td_list.push(<td key={key}>{capitalizeFirstLetter(value)}</td>);
    }
  }

  td_list.push(<td><button 
    onClick={() => {
      fetchDrug(data.id);
    }}
    className="btn btn-base-200 text-gray hover:text-white">Редактировать</button></td>);

  td_list.push(<td><button 
    onClick={() => {
      deleteDrug(data.id);
      fetchStatistics();
    }}
    className="btn btn-base-200 text-gray hover:text-white">Удалить</button></td>);

    return td_list;
  };

  // onClick delete selected
  const deleteDrug = async (id) => {
    await axios.delete(`http://localhost:8000/api/v1/drug/${id}`);
    renderPagination(pageNumber);
  };

   // onClick edit selected
   const createOrEditDrug = async () => {

      
      if (drug.id) {
        await axios.patch(`http://localhost:8000/api/v1/drug/${drug.id}`, drug)
      } else {
        if (
          drug.name != null && drug.description != null
          && drug.leave_condition != null && drug.manufacturer_id != null && 
          drug.release_form_id != null) {
            await axios.post(`http://localhost:8000/api/v1/drug/`, drug)
          }
      }
      renderPagination(1);
      
  };

  // onClick render pagination
  const renderPagination = async (page) => {
    
    fetchStatistics();

    const url = `http://localhost:8000/api/v1/drug/?page=${page}&size=${pageSize}`
    
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

  // clear all 
 const clearAll = () => {
  drug.id = null
  drug.name = null
  drug.description = null
  document.getElementById('nameInput').value = '';
  document.getElementById('descriptionInput').value = '';
};

const onSearchHandler = async (data) => {
    const filter = `name*${data}-description*${data}`
    setFilteredColumn(filter)
    let url = `http://localhost:8000/api/v1/drug/?&page=${pageNumber}&size=${pageSize}&filter=${filter}`
  

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

        {/* create drug*/}
        <div>
          <input
          type="text"
          className="input input-bordered input-base-200"
          placeholder="Название"
          id="nameInput"
          value={drug.name}
          onChange={(e) => SetDrug({...drug, name:e.target.value})}
          />

          <input
          type="text"
          className="input input-bordered input-base-200"
          placeholder="Описание"
          id="descriptionInput"
          value={drug.description}
          onChange={(e) => SetDrug({...drug, description:e.target.value})}
          />
          
          <select 
          className="select select-bordered max-w-xs my-4"
          onChange={(e) => {
            SetDrug({...drug, leave_condition:e.target.value})
          }}
          >
          {recipeOption.map((data, index) => {
            return (<option key={index} value={data}>{data}</option>)
          })}
          </select>

          <select 
          className="select select-bordered max-w-xs my-4"
          onChange={(e) => {
            SetDrug({...drug, manufacturer_id:e.target.value})
          }}
          >
          {manufacturers.map((data, index) => {
            return (<option key={index} value={data.id}>{data.name}</option>)
          })}
          </select>

          <select 
            className="select select-bordered max-w-xs my-4"
            menuPlacement="auto"
            menuPosition="fixed"
            onChange={(e) => {
              SetDrug({...drug, release_form_id:e.target.value})
            }}
            >
            {release_forms.map((data, index) => {
              return (<option key={index} value={data.id}>{data.form}</option>)
            })}
          </select>

          <button 
            onClick={() => {
              createOrEditDrug();
              clearAll();
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
          <p>Кол-во препаратов продающихся без рецепта {notHaveReception}, по рецепту {haveReception}</p>
        </div>
      </div>
    </div>
  </React.Fragment>
}