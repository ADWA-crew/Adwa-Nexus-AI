import { useContext } from 'react';
import { VisitorContext } from '../context/VisitorContext';

export const useVisitor = () => useContext(VisitorContext);
