import api from "./api";


export const getRestaurantStats = async (id, from, to) => {
    const response = await api.get(
        `Orders/restaurant/${id}/revenue?from=${from}&to=${to}`
    );
    return response.data;
};

export const getRestaurantCanceledStats = async (id, from, to) => {
    const response = await api.get(
        `Orders/restaurant/${id}/canceled?from=${from}&to=${to}`
    );
    return response.data;
};

export const getDishStats = async(dishId, from, to) => {
    const response = await api.get(
        `Orders/dishes/${dishId}/revenue?from=${from}&to=${to}`
    );
    return response.data;
}

export const getReportPdf = async (restaurantId) => {
    try {
        const response = await api.get(
            `Orders/get-report-pdf?restaurantId=${restaurantId}`,
            { responseType: 'blob' }
        );

        const blob = new Blob([response.data], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `report-${restaurantId}.pdf`;
        link.click();
        return true;
    } catch (error) {
        console.error("Error downloading PDF report:", error);
        return false;
    }
};
