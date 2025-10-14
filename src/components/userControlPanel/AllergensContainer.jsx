import React, { useEffect, useState } from "react";
import * as userService from "../../services/user.services.tsx";
import AllergenView from "./AllergenView";

export default function AllergensContainer({ active }) {
  const [alergens, setAlergens] = useState([]);

  // 1. Učitaj sve alergene odmah
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const all = await userService.getAllergens();
        // inicijalno svi bez selekcije
        const mapped = all.map((a) => ({
          ...a,
          id: a.allergenGuid ?? a.id,
          selected: false
        }));
        setAlergens(mapped);
      } catch (err) {
        console.error("Greška pri učitavanju svih alergena:", err);
      }
    };
    fetchAll();
  }, []);

  // 2. Kada se učitaju alergeni, povuci korisnikove i označi
  useEffect(() => {
    const fetchMine = async () => {
      try {
        const mine = await userService.getMyAllergens(); 
        // očekujem { allergenIds: [...] }
        setAlergens((prev) =>
          prev.map((a) => ({
            ...a,
            selected: mine.includes(a.id)
          }))
        );
      } catch (err) {
        console.error("Greška pri učitavanju korisnikovih alergena:", err);
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
      await userService.putMyAllergens({ allergenIds: selectedIds });
      console.log("Alergeni uspešno sačuvani!");
    } catch (err) {
      console.error("Greška pri čuvanju alergena:", err);
    }
  };

  return (
    <AllergenView
      alergens={alergens}
      toggleAlergen={toggleAlergen}
      handleSubmitAlergens={handleSubmitAlergens}
      active={active}
    />
  );
}
