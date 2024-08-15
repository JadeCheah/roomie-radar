import React, { createContext, useState, useContext } from 'react';

// Create the context with a default value
const PhotoSelectionContext = createContext({
    postImg: '',
    setPostImg: () => {}
});

// Export a custom hook to use the context
export const usePhotoSelection = () => useContext(PhotoSelectionContext);

// Create a provider component
export const PhotoSelectionProvider = ({ children }) => {
    const [postImg, setPostImg] = useState('');

    return (
        <PhotoSelectionContext.Provider value={{ postImg, setPostImg }}>
            {children}
        </PhotoSelectionContext.Provider>
    );
};

export default PhotoSelectionContext;
