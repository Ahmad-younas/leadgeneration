import React from 'react';
import { ComponentPreview, Previews } from '@react-buddy/ide-toolbox';
import { PaletteTree } from './palette';
import { AdminDashboard } from '../Admin/AdminDashboard';

const ComponentPreviews = () => {
  return <Previews palette={<PaletteTree />}></Previews>;
};

export default ComponentPreviews;
