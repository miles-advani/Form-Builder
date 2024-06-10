import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const initialFormElements = [
  { id: '1', type: 'input', label: 'Input', placeholder: 'Enter your text' },
  { id: '2', type: 'button', label: 'Button', text: 'Submit' },
  // Add more form elements here
];

export default function App() {
  const [formElements, setFormElements] = useState(initialFormElements);
  const [formStructure, setFormStructure] = useState([]);

  // Function to handle drag and drop events
function handleOnDragEnd(result) {
  if (!result.destination) return;

  if (result.source.droppableId === 'formElementsDroppable' && result.destination.droppableId === 'formLayoutDroppable') {
    const draggedElement = formElements.find(el => el.id === result.draggableId);
    if (draggedElement) {
      const updatedCanvas = [...formStructure, draggedElement];
      setFormStructure(updatedCanvas);
      // Remove the dragged element from the formElements list
      const updatedFormElements = formElements.filter(el => el.id !== result.draggableId);
      setFormElements(updatedFormElements);
    }
  } else if (result.source.droppableId === 'formLayoutDroppable' && result.destination.droppableId === 'formLayoutDroppable') {
    const reorderedCanvas = Array.from(formStructure);
    const [removed] = reorderedCanvas.splice(result.source.index, 1);
    reorderedCanvas.splice(result.destination.index, 0, removed);
    setFormStructure(reorderedCanvas);
  }
}

// Function to render form elements in the form elements container
function renderFormElements() {
  return formElements.map(({ id, type, label, placeholder, text }, index) => (
    <Draggable key={id} draggableId={id} index={index}>
      {(provided) => (
        <div
          className="draggable-item"
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          {type === 'input' ? (
            <input type="text" placeholder={placeholder} />
          ) : type === 'button' ? (
            <button>{text}</button>
          ) : null}
        </div>
      )}
    </Draggable>
  ));
}

  // Function to render the form structure in the form layout container
function renderCanvas() {
  return formStructure.map(({ id, label, props }, index) => (
    <Draggable key={id} draggableId={id} index={index}>
      {(provided) => (
        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
          {label === 'Input' ? (
            <input type="text" {...props} />
          ) : label === 'Button' ? (
            <button {...props}>Submit</button>
          ) : null}
        </div>
      )}
    </Draggable>
  ));
}

  // Function to generate JSX code based on form structure
  function generateFormCode() {
    return formStructure.map(({ id, label, ...props }) => {
      if (label === 'Input') {
        return `<input key={${id}} type="text" {...${JSON.stringify(props)}} />`;
      } else if (label === 'Button') {
        return `<button key={${id}} {...${JSON.stringify(props)}}>Submit</button>`;
      }
      return null;
    }).join('\n');
  }

 return (
  <div>
    <h1>Form Builder</h1>
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <div className="form-builder">
        <div className="form-elements-container" style={{ width: '300px', border: '1px solid #ccc', padding: '10px' }}>
          <h2>Form Elements</h2>
          <Droppable droppableId="formElementsDroppable">
            {(provided) => (
              <ul {...provided.droppableProps} ref={provided.innerRef}>
                {renderFormElements()}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </div>
        <div className="form-layout-container" style={{ flex: 1, border: '1px solid #ccc', padding: '10px' }}>
          <h2>Form Layout</h2>
          <Droppable droppableId="formLayoutDroppable">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {renderCanvas()}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </div>
    </DragDropContext>
    <div>
      <h2>Generated Form Code</h2>
      <pre>{generateFormCode()}</pre>
    </div>
  </div>
);
}









