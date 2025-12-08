export interface Theme {
  colors: {
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    primary: string;
    secondary: string;
    border: string;
    success: string;
    warning: string;
    error: string;
    danger: string;
  };
}

export const lightTheme: Theme = {
  colors: {
    background: '#ffffff',
    surface: '#f5f5f5',
    text: '#333333',
    textSecondary: '#666666',
    primary: '#2196f3',
    secondary: '#ff9800',
    border: '#e0e0e0',
    success: '#4caf50',
    warning: '#ff9800',
    error: '#f44336',
    danger: '#d32f2f',
  },
};

export const darkTheme: Theme = {
  colors: {
    background: '#121212',
    surface: '#1e1e1e',
    text: '#ffffff',
    textSecondary: '#aaaaaa',
    primary: '#90caf9',
    secondary: '#ffcc80',
    border: '#333333',
    success: '#81c784',
    warning: '#ffb74d',
    error: '#e57373',
    danger: '#ef5350',
  },
};

