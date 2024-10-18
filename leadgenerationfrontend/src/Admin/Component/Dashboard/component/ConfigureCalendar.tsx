import { Calendar as BigCalendar,CalendarProps, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import { useColorModeValue } from '@chakra-ui/react';
import React from 'react';
import customToolbar from './CustomToolbar';

const localizer = momentLocalizer(moment);
export const ConfigureCalendar: React.FC<Omit<CalendarProps<any, object>, 'localizer'>> = (props) => {
  let mainTeal = useColorModeValue('teal.300', 'teal.300');
  const currentDay = moment("2024-09-10 16:37:27").format('DD');
  return <BigCalendar {...props} localizer={localizer} startAccessor="start"
                      endAccessor="end"
                      titleAccessor="title"
                      components={{
                        toolbar:customToolbar
                      }}
                      style={{ height: "100%", backgroundColor:"white",padding:'20px', borderRadius:"16px", marginTop:"50px" }}
                      dayPropGetter={(date) => {
                        // Format the date to match the keys in your dateColors object
                        const formattedDate = moment(date).format('DD');
                        console.log(formattedDate);
                        // Set default style
                        let style = { backgroundColor: 'teal.400' }; // Default color for days without specific colors

                        // Apply specific color if the date matches
                        if (formattedDate=== currentDay) {
                          style.backgroundColor = "#B2DFDB";
                        }

                        return { style };
                      }}

                      eventPropGetter={(event) => {
                        // Customize event styles
                        let newStyle = {
                          backgroundColor: "#EAF6FF",
                          color: 'black',
                          borderRadius: "10px",
                          border: "none",
                        };

                        if (event.title === "Booked") {
                          newStyle.backgroundColor = '#26A69A';// Different color for specific events
                          newStyle.color = 'white';
                          newStyle.color = 'white'

                        }
                        if (event.title === "Insulated") {
                          newStyle.backgroundColor = '#42A5F5';// Different color for specific events
                          newStyle.color = 'white';
                        }
                        if (event.title === "Canceled") {
                          newStyle.backgroundColor = '#EF5350';// Different color for specific events
                          newStyle.color = 'white';
                        }
                        if(event.title === "Submitted") {
                          newStyle.backgroundColor = '#FFA726';
                          newStyle.color = 'white';
                        }

                        return {
                          className: "",
                          style: newStyle
                        };
                      }}
  />;
};


