import React, { useEffect, useState } from "react";
import * as userService from "../../services/user.services.jsx";
import AllergenView from "./AllergenView";

export default function AllergensContainer({ active,isAdmin  }) {
  const [alergens, setAlergens] = useState([]);


  useEffect(() => {
    const fetchAll = async () => {
      if (isAdmin) {
        console.log("Admin – preskačem (200 OK fallback)");
        return;
      }
      try {
        const all = await userService.getAllergens();

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
  }, [isAdmin]);


  useEffect(() => {
    const fetchMine = async () => {
      if (isAdmin) {
        console.log("Admin – preskačem (200 OK fallback)");
        return;
      }
      try {
        const mine = await userService.getMyAllergens(); 

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
  }, [alergens.length,isAdmin]);

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
