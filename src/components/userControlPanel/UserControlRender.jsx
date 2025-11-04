import React, { useState, useEffect } from "react";
import "../../styles/userControlPanel.scss";
import "../../styles/courierPanel.scss";
import AccountPanel from "./AccountPanel.jsx";
import * as userService from "../../services/user.services"; 
import VoucherList from "../customerComponents/VoucherList.jsx";

export default function ProfilePage() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("profil-view");
  const [profile, setProfile] = useState(null);
  const [user, setUser] = useState(null);
  const [alergens, setAlergens] = useState([]);
  const [currentAddress, setCurrentAddress] = useState({ addresses: [] });
  const [newAddress, setNewAddress] = useState({
    streetAndNumber: "",
    city: "",
    postalCode: ""
  });
  const [editingAddress, setEditingAddress] = useState(null);
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [vouchers, setVouchers] = useState(null);
  sessionStorage.setItem('roles', user);
  const isCustomer = user?.roles?.some(r => r.toLowerCase().includes("customer"));
  const isCourier = user?.roles?.some(r => r.toLowerCase().includes("courier"));
  const isAdmin = user?.roles?.some(r => r.toLowerCase().includes("administrator"));
  const isOwner = user?.roles?.some(r => r.toLowerCase().includes("owner"));

  // 🔄 Učitavanje podataka
  useEffect(() => {
    (async () => {
      const prof = await userService.getProfile();

      if (prof.profilePictureBase64) {
        prof.imageUrl = prof.profilePictureBase64;
      }

      setProfile(prof);
      setUser(prof);
      console.log("Učitani podaci profila:", prof);

      if (prof.roles?.some((r) => !r.toLowerCase().includes("customer"))) {
        setAlergens([]);
        setCurrentAddress({ addresses: [] });
        return;
      }
      if (prof.roles?.includes("Customer")) {
        try {
          setLoading(true);
          const allergens = await userService.getAllergens();
          const vouchers = await userService.getMyVouchers();
          setAlergens(allergens.map((a) => ({ ...a, selected: false })));
          setVouchers(vouchers)
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
      } else {
        return;
      }
      try {
        setLoading(true);
        const addresses = await userService.getMyAddresses();
        setCurrentAddress({ addresses });
      } catch (error) {
        if (error.response) {
          if (error.response.status === 404) {
            setError("Pogresna ruta.");
          } else if (error.response.status === 401) {
            setError(
              "Ova stranica je samo za prijavljene."
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
    })();
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setUser((prev) => ({ ...prev, [id]: value }));
  };

  // ✏️ Izmena korisnika
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isCustomer) {
      console.log("Nije 'Customer' – preskačem update profila (200 OK fallback)");
      return;
    }

    const formData = new FormData();
    formData.append("firstName", user.firstName);
    formData.append("lastName", user.lastName); 
    formData.append("email", user.email);

    if (profilePictureFile) {
      formData.append("ProfilePictureBase64", profilePictureFile);
    }
    console.log("Ažuriranje profila sa podacima: ", {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      profilePictureFile,
    });

    
    try {
      setLoading(true);
      await userService.updateProfile(formData);
      setError("");
      alert("Uspesno ste izmenili profil");
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          setError("Niste uneli validne podatke.");
        } else if (error.response.status === 404) {
          setError("Ne postoji profil sa ovim id-em.");
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

    const updated = await userService.getProfile();
    if (updated.profilePictureBase64) {
      updated.imageUrl = updated.profilePictureBase64;
    }
    setProfile(updated);
    setUser(updated);
    window.location.reload();
  };

  // 🧬 Alergeni
  const toggleAlergen = (id) => {
    setAlergens((prev) =>
      prev.map((a) => (a.id === id ? { ...a, selected: !a.selected } : a))
    );
  };

  const handleSubmitAlergens = async (e) => {
    e.preventDefault();
    if (!isCustomer) {
      console.log("Nije 'Customer' – preskačem čuvanje alergena (200 OK fallback)");
      return;
    }

    const selectedIds = alergens.filter((a) => a.selected).map((a) => a.id);

    try {
      setLoading(true);
      await userService.putMyAllergens({ allergenIds: selectedIds });
      sessionStorage.setItem('myAllergens', JSON.stringify(selectedIds));
      console.log("Alergeni uspešno sačuvani!");
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

  // 📍 Adrese
  const refreshAddresses = async () => {
    if (!isCustomer) {
      console.log(
        "Nije 'Customer' – preskačem refresh adresa (200 OK fallback)"
      );
      setCurrentAddress({ addresses: [] });
      return;
    }
    try {
      setLoading(true);
      const addresses = await userService.getMyAddresses();
      setCurrentAddress({ addresses });
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          setError("Pogresna ruta.");
        } else if (error.response.status === 401) {
          setError("Ova stranica je samo za prijavljene.");
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

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!isCustomer) {
      console.log(
        "Nije 'Customer' – preskačem dodavanje adrese (200 OK fallback)"
      );
      return;
    }

    try {
      setLoading(true);
      await userService.addAddress(newAddress);
      await refreshAddresses();
      setNewAddress({ streetAndNumber: "", city: "", postalCode: "" });
      setError("");
      alert("Uspesno ste dodali adresu");
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          setError("Niste uneli validne podatke.");
        } else if (error.response.status === 404) {
          setError("Pogresna ruta.");
        } else if (error.response.status === 401) {
          setError("Ova stranica je rezervisana samo za customere.");
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

  const handleUpdateAddress = async (e) => {
    e.preventDefault();
    if (!isCustomer) {
      console.log("Nije 'Customer' – preskačem update adrese (200 OK fallback)");
      return;
    }

    try {
      setLoading(true);
      await userService.updateAddress(editingAddress.id, newAddress);
      await refreshAddresses();
      setEditingAddress(null);
      setNewAddress({ streetAndNumber: "", city: "", postalCode: "" });
      setError("");
      alert("Uspesno ste izmenili adresu");
      navigate(-1);
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          setError("Niste uneli validne podatke.");
        } else if (error.response.status === 404) {
          setError("Ne postoji adresa sa ovim id-em.");
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

  const handleDeleteAddress = async (id) => {
    if (!isCustomer) {
      console.log(
        "Nije 'Customer' – preskačem brisanje adrese (200 OK fallback)"
      );
      return;
    }
    try {
      if (!window.confirm("Da li ste sigurni da zelite da uklonite adresu?")) {
        return;
      }
      setLoading(true);
      await userService.deleteAddress(id);
      await refreshAddresses();
      setError("");
      alert("Uspesno ste uklonili adresu");
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          setError("Adresa sa ovim id-em ne postoji.");
        } else if (error.response.status === 401) {
          setError("Ova stranica je rezervisana samo za customere.");
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

  const handleEditAddress = (addr) => {
    setEditingAddress(addr);
    setNewAddress(addr);
  };

  if (loading) return <div id="loadingSpinner" className="spinner"></div>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  return (
    <AccountPanel
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      profile={profile}
      user={user}
      isCustomer={isCustomer}
      isAdmin={isAdmin}
      isOwner={isOwner}
      isCourier={isCourier}
      handleSubmit={handleSubmit}
      setProfilePictureFile={setProfilePictureFile}
      alergens={alergens}
      toggleAlergen={toggleAlergen}
      handleSubmitAlergens={handleSubmitAlergens}
      currentAddress={currentAddress}
      handleEditAddress={handleEditAddress}
      handleDeleteAddress={handleDeleteAddress}
      handleInputChange={handleInputChange}
      newAddress={newAddress}
      setNewAddress={setNewAddress}
      editingAddress={editingAddress}
      setEditingAddress={setEditingAddress}
      handleAddAddress={handleAddAddress}
      handleUpdateAddress={handleUpdateAddress}
      vouchers={vouchers}
    />
  );
}
