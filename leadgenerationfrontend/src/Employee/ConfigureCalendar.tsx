import React, { useState } from 'react';
import { Calendar as BigCalendar, CalendarProps, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Text
} from '@chakra-ui/react';
import ReactApexChart from 'react-apexcharts';
import customToolbar from './CustomToolbar';

const localizer = momentLocalizer(moment);

interface Event {
  title: string;
  start: Date;
  end: Date;
  description?: string;
}

type ConfigureCalendarProps = Omit<CalendarProps<Event, object>, 'localizer'>;

export const ConfigureCalendar: React.FC<ConfigureCalendarProps> = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const onEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsOpen(true);
  };

  const onClose = () => {
    setIsOpen(false);
    setSelectedEvent(null);
  };

  return (
    <React.Fragment>
      <BigCalendar
        {...props}
        localizer={localizer}
        startAccessor="start"
        endAccessor="end"
        titleAccessor="title"
        components={{
          toolbar:customToolbar
        }}
        style={{ height: "100%", backgroundColor: "white", padding: '20px', borderRadius: "16px", marginTop: "50px" }}
        eventPropGetter={(event) => {
          let newStyle = {
            backgroundColor: "#FFFFFF",
            color: 'black',
            borderRadius: "10px",
            border: "none",
          };

          switch (event.title) {
            case "Booked":
              newStyle.backgroundColor = '#26A69A';
              newStyle.color = 'white';
              break;
            case "Insulated":
              newStyle.backgroundColor = '#42A5F5';
              newStyle.color = 'white';
              break;
            case "Canceled":
              newStyle.backgroundColor = '#EF5350';
              newStyle.color = 'white';
              break;
            case "Submitted":
              newStyle.backgroundColor = '#FFA726';
              newStyle.color = 'white';
              break;
          }

          return {
            className: "",
            style: newStyle,
          };
        }}
        onSelectEvent={onEventClick}
      />

      {selectedEvent && (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{selectedEvent.title}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text><strong>Start:</strong> {moment(selectedEvent.start).format('MMMM Do YYYY, h:mm A')}</Text>
              <Text><strong>End:</strong> {moment(selectedEvent.end).format('MMMM Do YYYY, h:mm A')}</Text>
              <Text>{selectedEvent.description || 'No additional details'}</Text>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="teal" onClick={onClose}>Close</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </React.Fragment>
  );
};
