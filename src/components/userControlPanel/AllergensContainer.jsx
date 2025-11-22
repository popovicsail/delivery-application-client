import React, { useEffect, useState } from "react";
import * as userService from "../../services/user.services.jsx";
import AllergenView from "./AllergenView";

export default function AllergensContainer({ active}) {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [alergens, setAlergens] = useState([]);
  const myProfile = JSON.parse(sessionStorage.getItem("myProfile"));
  const roles = myProfile ? myProfile.roles : [];

  // 1. Učitaj sve alergene odmah
  useEffect(() => {
    if (!roles || !roles.includes("Customer")) return;
    const fetchAll = async () => {
      try {
        setLoading(true);
        const all = await userService.getAllergens();
        // inicijalno svi bez selekcije
        const mapped = all.map((a) => ({
          ...a,
          id: a.allergenGuid ?? a.id,
          selected: false,
        }));
        setAlergens(mapped);
      } catch (error) {
        if (error.response) {
          if (error.response.status === 404) {
            setError("Pogresna ruta.");
          } else if (error.response.status === 401) {
            setError("Ova stranica je rezervisana samo za prijavljene i customere.");
          } else if (error.response.status === 500) {
            setError("Greska na serveru. Pokusajte kasnije.");
          } else {
            setError(`Greska: ${error.response.status}`);
          }
        } else if (error.request) {
          setError("Nema odgovora sa servera.");
        } else {
          setError("Doslo je do greske.");
        }
        console.error("Greska:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // 2. Kada se učitaju alergeni, povuci korisnikove i označi
  useEffect(() => {
    if (!roles || !roles.includes("Customer")) return;
    const fetchMine = async () => {
      try {
        setLoading(true);
        const mine = await userService.getMyAllergens();
        console.log("Korisnikovi alergeni:", mine);
        // očekujem { allergenIds: [...] }
        setAlergens((prev) =>
          prev.map((a) => ({
            ...a,
            selected: mine.includes(a.id),
          }))
        );
      } catch (error) {
        if (error.response) {
          if (error.response.status === 404) {
            setError("Pogresna ruta.");
          } else if (error.response.status === 401) {
            setError(
              "Ova stranica je rezervisana samo za prijavljene i customere."
            );
          } else if (error.response.status === 500) {
            setError("Greska na serveru. Pokusajte kasnije.");
          } else {
            setError(`Greska: ${error.response.status}`);
          }
        } else if (error.request) {
          setError("Nema odgovora sa servera.");
        } else {
          setError("Doslo je do greske.");
        }
        console.error("Greska:", error.message);
      } finally {
        setLoading(false);
      }
    };

    if (alergens.length > 0) {
      fetchMine();
    }
  }, [alergens.length]);

  // 3. Toggle logika
  const toggleAlergen = (id) => {
    setAlergens((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, selected: !a.selected } : a
      )
    );
  };

  // 4. Submit logika
  const handleSubmitAlergens = async (e) => {
    e.preventDefault();
    const selectedIds = alergens.filter((a) => a.selected).map((a) => a.id);

    try {
      setLoading(true);
      await userService.putMyAllergens({ allergenIds: selectedIds });
      sessionStorage.setItem('myAllergens', JSON.stringify(selectedIds));
      console.log("Alergeni uspešno sačuvani!");
      window.location.reload();
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          setError('Niste uneli validne podatke.');
        } else if (error.response.status === 404) {
          setError('Ne postoji customer sa ovim id-em.');
        } else if (error.response.status === 500) {
          setError('Greska na serveru. Pokusajte kasnije.');
        } else {
          setError(`Greska: ${error.response.status}`);
        }
      } else if (error.request) {
        setError('Nema odgovora sa servera.');
      } else {
        setError('Doslo je do greske.');
      }
      console.error('Greska:', error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div id="loadingSpinner" className="spinner"></div>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  return (
    <AllergenView
      alergens={alergens}
      toggleAlergen={toggleAlergen}
      handleSubmitAlergens={handleSubmitAlergens}
      active={active}
    />
  );
}