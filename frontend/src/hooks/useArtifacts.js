import { useState, useEffect } from 'react';
import { artifactService } from '../services/artifact.service';

export const useArtifacts = (params) => {
  const [artifacts, setArtifacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    artifactService.getAll(params)
      .then((res) => setArtifacts(res.data))
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { artifacts, loading, error };
};
