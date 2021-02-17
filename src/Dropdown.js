// You must import Dropdown, DropdownButton and ButtonGroup to be able to make them usable
import React, { Component } from 'react';
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
import ButtonGroup from 'react-bootstrap/ButtonGroup'

function MyDropdown() {
  // 1. You must always close a tag
  // 2. JSX templates in JavaScript are like a way of create a contract to later render content - 
  //    the parser only knows when JSX templates stop and go back to JavaScript when the last 
  //    matching closing tag to the first opening tag is reached
  //    e.g. <div>this isn't interpreted as code</div>;thisIs();
  // 3. You must return the JSX template from the function which 
  //    you call (e.g. from `App()` in `App.js`)
  
  return (
    <Dropdown>
      <Dropdown.Toggle variant="success" id="dropdown-basic">
      </Dropdown.Toggle>
      <div>
        <DropdownButton>
          as={ButtonGroup}
          menuAlign={{ lg: 'right' }}
          title="Location"
          id="dropdownmenu">
        </DropdownButton>
      </div>

      <Dropdown.Toggle variant="success" id="dropdown-basic">
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item href="#/action-1">Australia</Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item href="#/action-2">NEM</Dropdown.Item>
        <Dropdown.Item href="#/action-3">WEM</Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item href="#/action-4">Victoria</Dropdown.Item>
        <Dropdown.Item href="#/action-5">New South Wales</Dropdown.Item>
        <Dropdown.Item href="#/action-6">Queensland</Dropdown.Item>
        <Dropdown.Item href="#/action-7">Northern Territory</Dropdown.Item>
        <Dropdown.Item href="#/action-8">Western Australia</Dropdown.Item>
        <Dropdown.Item href="#/action-9">South Australia</Dropdown.Item>
        <Dropdown.Item href="#/action-10">Tasmania</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}

// key line: make the function available to other modules when you go
// import MyDropdown from Dropdown
export default MyDropdown;
