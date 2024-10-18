// theme.ts

import { extendTheme } from '@chakra-ui/react';

export const AdminTheme = extendTheme({
  styles: {
    global: {
      // styles for the `body`
      body: {
        bg: '#F7FAFC', // Set the background color here
      },
    },
  },
});
