import React from 'react';
import { ToolbarProps, View } from 'react-big-calendar';
import { Button } from '@chakra-ui/react';
import { ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons';

interface CustomToolbarProps extends ToolbarProps {}

const CustomToolbar: React.FC<CustomToolbarProps> = (toolbar) => {
  const goToBack = () => {
    toolbar.onNavigate('PREV');
  };

  const goToNext = () => {
    toolbar.onNavigate('NEXT');
  };

  const goToToday = () => {
    toolbar.onNavigate('TODAY');
  };

  const handleViewChange = (view: View) => {
    toolbar.onView(view);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
      <div >
        <Button mr={2} leftIcon={<ArrowBackIcon />} colorScheme='teal' variant='solid' onClick={goToBack}>Back</Button>
        <Button mr={2} colorScheme='teal' variant='solid' onClick={goToToday}>Today</Button>
        <Button colorScheme='teal' variant='solid' rightIcon={<ArrowForwardIcon />} onClick={goToNext}>Next</Button>
      </div>
      <div>
        <span>{toolbar.label}</span>
      </div>
      <div>
        <Button mr={2}  colorScheme='teal' variant='solid' onClick={() => handleViewChange('day')}>Day</Button>
        <Button mr={2} colorScheme='teal' variant='solid' onClick={() => handleViewChange('month')}>Month</Button>
        <Button colorScheme='teal' variant='solid' onClick={() => handleViewChange('week')}>Week</Button>
      </div>
    </div>
  );
};

export default CustomToolbar;
