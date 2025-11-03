import React from "react";
import "../styles/main.scss";

const WorkerCard = ({ worker, handleSuspend, handleUnsuspend, isOwnerHere, setSelectedWorker, setComponent }) => {

  function formatDate(inputDate) {
    const date = new Date(inputDate);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return `${day}.${month}.${year}.`;
  }
  
  return(
    <div className="worker-card">
        <div className={`worker-activity ${worker.isSuspended ? 'worker-suspended' : worker.isActive ? 'worker-active' : 'worker-inactive'}`}
        title={worker.isSuspended ? 'Povuci suspenziju' : 'Suspenduj'}
        onClick={(e) => worker.isSuspended ? handleUnsuspend(worker.id, worker.firstName +" "+ worker.lastName) : handleSuspend(worker.id, worker.firstName +" "+ worker.lastName)}>
          <p>{worker.isSuspended ? 'Suspendovan' : worker.isActive ? 'Aktivan' : 'Neaktivan'}</p></div>
        <img src={worker.profilePictureBase64} alt={worker.firstName}/>
        <h3 className="worker-name">{worker.firstName +" "+ worker.lastName}</h3>
        <h3 className="worker-job">{worker.job}</h3>
        <section className="section-row-start">
            <label>Email:</label><p>{worker.email}</p>
        </section>
        <section className="section-row-start">
            <label>Telefon:</label><p>{worker.phoneNumber}</p>
        </section>
        {isOwnerHere && <section className="section-row-start worker-card-btn-row">
            <p className="worker-join-date">Od: {worker.createdAt && formatDate(worker.createdAt)}</p>
            <button className="buttons edit-btn" onClick={() => {setComponent("edit"); setSelectedWorker(worker);}}>Detalji</button>
        </section>}
    </div>
  );
}

export default WorkerCard;