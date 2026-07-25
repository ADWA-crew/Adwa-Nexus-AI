import { useState, useEffect } from 'react';
import { museumService } from '../services/museum.service';

export const useMuseums = (params) => {
  const [museums, setMuseums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    museumService.getAll(params)
      .then((res) => setMuseums(res.data))
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { museums, loading, error };
};
