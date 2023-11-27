import React from "react";

export default function BaseDesign() {
  return <React.Fragment>
    <div className="md:px-32 py-8-w-full">

    {/* header */}
    <div className="w-max relative my-5">
      
      {/* search */}
      <input 
        type="text" 
        placeholder="Search"
        className="input input-bordered input-base-200 w-full max-w-xs" />

      {/* select page */}
      <select className="select select-bordered w-full max-w-xs my-4">
        <option disabled selected>Page limit 5</option>
        <option disabled selected>Page limit 10</option>
        <option disabled selected>Page limit 20</option>
      </select>
    </div>

      {/* main table */}
      <div className="shadow overflow-hidden rounded border-b border-gray-200">
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Description</th>
                <th>Leave condition</th>
                <th>Release form</th>
                <th>Manufacturer</th>
              </tr>
            </thead>
            <tbody>
            <tr>
                <th>1</th>
                <th>Test</th>
                <th>Test</th>
                <th>Test</th>
                <th>Test</th>
                <th>Test</th>
              </tr>

              <tr>
                <th>1</th>
                <th>Test</th>
                <th>Test</th>
                <th>Test</th>
                <th>Test</th>
                <th>Test</th>
              </tr>

              <tr>
                <th>1</th>
                <th>Test</th>
                <th>Test</th>
                <th>Test</th>
                <th>Test</th>
                <th>Test</th>
              </tr>

              <tr>
                <th>1</th>
                <th>Test</th>
                <th>Test</th>
                <th>Test</th>
                <th>Test</th>
                <th>Test</th>
              </tr>
            </tbody>
          </table>
        </div>

      </div>

      {/* footer */}
      <div className="flex justify-between my-5">
        <div className="btn-group">
          <button className="btn bg-base-200 text-black hover:text-white">
            1
          </button>
          <button className="btn btn-neutral">
            2
          </button>
          <button className="btn bg-base-200 text-black hover:text-white">
            3
          </button>
        </div>
        <div className="content-center">
          <p>showing 2 to 2 of 12  entries</p>
        </div>
      </div>

    </div>
  </React.Fragment>
}