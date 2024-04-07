import React, { useState } from 'react';
import './App.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

function App() {
  const [primaryQueue, setPrimaryQueue] = useState([]);
  const [secondaryQueue, setSecondaryQueue] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const handleAddToPrimary = () => {
    if (inputValue.trim()) {
      setPrimaryQueue(current => [...current, inputValue]);
      setInputValue('');
    }
  };

  const handleAddToSecondary = () => {
    if (inputValue.trim()) {
      setSecondaryQueue(current => [...current, inputValue]);
      setInputValue('');
    }
  };

  const handleNextPrimary = () => {
    setPrimaryQueue(current => current.slice(1));
  };

  const handleNextSecondary = () => {
    setSecondaryQueue(current => current.slice(1));
  };

const onDragEnd = (result, queues, setQueue) => {
  const { destination, source } = result;
  // Dropped outside of list do nothing
  if (!destination) return;

  if (source.droppableId === destination.droppableId) {
    const items = Array.from(queues);
    const [ reorderedItem ] = items.splice(source.index, 1);
    items.splice(destination.index, 0, reorderedItem);

    setQueue(items);
  }
};

  return (
    <div className="container">
      <div className="queue-controls">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter Name"
        />
        <button onClick={handleAddToPrimary} className="primary-button">
          <FontAwesomeIcon icon={faPlus} />
        </button>
        <button onClick={handleNextPrimary} className="primary-button">
          <FontAwesomeIcon icon={faArrowRight} />
        </button>
        <button onClick={handleAddToSecondary} className="secondary-button">
          <FontAwesomeIcon icon={faPlus} />
        </button>
        <button onClick={handleNextSecondary} className="secondary-button">
          <FontAwesomeIcon icon={faArrowRight} />
        </button>
      </div>
      
      <DragDropContext
        onBeforeDragStart={() => setIsDragging(true)}
        onDragEnd={result => {
          setIsDragging(false);
          onDragEnd(result, primaryQueue, setPrimaryQueue);
        }}
      >
        <Droppable droppableId="primaryQueue">
          {(provided, snapshot) => (
            <div className="queue-list" {...provided.droppableProps} ref={provided.innerRef}>
              <h3>Primary Speaking Order</h3>
              <ul className="queue-list-ul">
                {primaryQueue.map((name, index) => (
                  <Draggable key={name} draggableId={name} index={index}>
                    {(provided, snapshot) => (
                      <li 
                        ref={provided.innerRef}
                        {...provided.draggableProps} 
                        {...provided.dragHandleProps}
                        className={snapshot.isDragging ? 'dragging' : ''}
                      >
                        {name}
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <DragDropContext
        onBeforeDragStart={() => setIsDragging(true)}
        onDragEnd={result => {
          setIsDragging(false);
          onDragEnd(result, secondaryQueue, setSecondaryQueue);
        }}
      >
        <Droppable droppableId="secondaryQueue">
          {(provided, snapshot) => (
            <div className="queue-list" {...provided.droppableProps} ref={provided.innerRef}>
              <h3>Secondary Speaking Order</h3>
              <ul className="queue-list-ul">
                {secondaryQueue.map((name, index) => (
                  <Draggable key={name} draggableId={name} index={index}>
                    {(provided, snapshot) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps} 
                        {...provided.dragHandleProps}
                        className={snapshot.isDragging ? 'dragging' : ''}
                      >
                        {name}
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            </div>
          )}
          </Droppable>
        </DragDropContext>
    </div>
  );
}

export default App;
