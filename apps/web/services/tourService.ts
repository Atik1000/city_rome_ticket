import { API_BASE_URL } from "./authService";

export interface TourImage {
    id: number;
    file: string;
    status: string;
}

export interface TourLocation {
    id: number;
    name: string;
    description: string;
    created_at: string;
}

export interface TourPlan {
    id: number;
    locations: TourLocation[];
    images: TourImage[];
    title: string;
    description: string;
    max_adults: number;
    price_adult: string;
    adult_age_min: number;
    adult_age_max: number;
    max_children: number;
    price_child: string;
    child_age_min: number;
    child_age_max: number;
    max_infants: number;
    price_infant: string;
    infant_age_min: number;
    infant_age_max: number;
    max_youth: number;
    price_youth: string;
    youth_age_min: number;
    youth_age_max: number;
    max_student_eu: number;
    price_student_eu: string;
    student_eu_age_min: number;
    student_eu_age_max: number;
    free_cancellation: boolean;
    pickup_included: boolean;
    highlights: string[];
    full_description: string | null;
    includes: string[];
    excludes: string[];
    not_suitable_for: string[];
    not_allowed: string[];
    know_before_you_go: string[];
    duration_days: number | null;
    status: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface TourPlanResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: TourPlan[];
}

export interface TourFilterParams {
    page?: number;
    duration_days_min?: number;
    duration_days_max?: number;
    price_adult_min?: number;
    price_adult_max?: number;
    search?: string;
}

export async function getTourPlans(params: TourFilterParams = {}): Promise<TourPlanResponse> {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append("page", params.page.toString());
    else queryParams.append("page", "1");

    if (params.duration_days_min !== undefined) queryParams.append("duration_days_min", params.duration_days_min.toString());
    if (params.duration_days_max !== undefined) queryParams.append("duration_days_max", params.duration_days_max.toString());
    if (params.price_adult_min !== undefined) queryParams.append("price_adult_min", params.price_adult_min.toString());
    if (params.price_adult_max !== undefined) queryParams.append("price_adult_max", params.price_adult_max.toString());
    if (params.search) queryParams.append("search", params.search);

    const response = await fetch(`${API_BASE_URL}/tour/plan/?${queryParams.toString()}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        let errorMessage = "Failed to fetch tour plans";
        if (errorData.non_field_errors && Array.isArray(errorData.non_field_errors)) {
            errorMessage = errorData.non_field_errors[0];
        } else {
            errorMessage = errorData.message || errorMessage;
        }
        throw new Error(errorMessage);
    }

    return response.json();
}

export async function getTourById(id: number | string): Promise<TourPlan> {
    const response = await fetch(`${API_BASE_URL}/tour/plan/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        let errorMessage = "Failed to fetch tour details";
        if (errorData.non_field_errors && Array.isArray(errorData.non_field_errors)) {
            errorMessage = errorData.non_field_errors[0];
        } else {
            errorMessage = errorData.message || errorMessage;
        }
        throw new Error(errorMessage);
    }

    return response.json();
}

export interface TourDate {
    id: number;
    date: string;
    is_active: boolean;
    created_at: string;
    tour_plan: number;
}

export interface TourDateResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: TourDate[];
}

export async function getTourDates(tourId: number | string): Promise<TourDateResponse> {
    const response = await fetch(`${API_BASE_URL}/tour/plan/date/${tourId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        let errorMessage = "Failed to fetch tour dates";
        if (errorData.non_field_errors && Array.isArray(errorData.non_field_errors)) {
            errorMessage = errorData.non_field_errors[0];
        } else {
            errorMessage = errorData.message || errorMessage;
        }
        throw new Error(errorMessage);
    }

    return response.json();
}

export interface TourTimeSlot {
    id: number;
    start_time: string;
    end_time: string;
    available_adults: number;
    available_children: number;
    available_infants: number;
    available_youth: number;
    available_student_eu: number;
    is_active: boolean;
    created_at: string;
    tour_date: number;
}

export interface TourTimeSlotResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: TourTimeSlot[];
}

export async function getTourTimeSlots(tourDateId: number | string): Promise<TourTimeSlotResponse> {
    const response = await fetch(`${API_BASE_URL}/tour/plan/date/time/${tourDateId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        let errorMessage = "Failed to fetch tour time slots";
        if (errorData.non_field_errors && Array.isArray(errorData.non_field_errors)) {
            errorMessage = errorData.non_field_errors[0];
        } else {
            errorMessage = errorData.message || errorMessage;
        }
        throw new Error(errorMessage);
    }

    return response.json();
}

export interface AddToCartPayload {
    num_adults: number;
    num_children: number;
    num_infants: number;
    num_youth: number;
    num_student_eu: number;
    tour_plan: number;
    time_slot: number;
}

export interface AddToCartResponse {
    id: number;
    num_adults: number;
    num_children: number;
    num_infants: number;
    item_price: number;
    num_youth: number;
    num_student_eu: number;
    created_at: string;
    updated_at: string;
    user: number;
    tour_plan: number;
    time_slot: number;
}

export async function addToCart(payload: AddToCartPayload): Promise<AddToCartResponse> {
    const response = await fetch(`${API_BASE_URL}/tour/cart/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        let errorMessage = "Failed to add item to cart";
        if (errorData.non_field_errors && Array.isArray(errorData.non_field_errors)) {
            errorMessage = errorData.non_field_errors[0];
        } else {
            errorMessage = errorData.message || errorMessage;
        }
        throw new Error(errorMessage);
    }

    return response.json();
}

export interface CartItem {
    id: number;
    num_adults: number;
    num_children: number;
    num_infants: number;
    item_price: string;
    num_youth: number;
    num_student_eu: number;
    created_at: string;
    updated_at: string;
    user: number | null;
    tour_plan: number;
    time_slot: number;
}

export interface CartResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: CartItem[];
}

export interface TravelerDetail {
    name: string;
    email: string;
}

export interface SingleItemPayload {
    num_adults: number;
    num_children: number;
    num_infants: number;
    num_youth: number;
    num_student_eu: number;
    tour_plan: number;
    time_slot: number;
}

export interface BookingPayload {
    cart_item_ids?: number[]; // Array of integers, optional for book now
    book_now?: string; // "true"
    single_item?: SingleItemPayload;
    traveler_details: TravelerDetail[];
    full_name?: string;
    email?: string;
    country?: string;
    phone?: string;
}

export async function createBooking(payload: BookingPayload, token?: string): Promise<any> {
    const headers: HeadersInit = {
        "Content-Type": "application/json",
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/tour/booking/`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        let errorMessage = "Failed to create booking";
        if (errorData.non_field_errors && Array.isArray(errorData.non_field_errors)) {
            errorMessage = errorData.non_field_errors[0];
        } else {
            errorMessage = errorData.message || errorMessage;
        }
        throw new Error(errorMessage);
    }

    return response.json();
}

export async function getCart(cartIds: number[]): Promise<CartResponse> {
    const idsParam = cartIds.join(",");
    const response = await fetch(`${API_BASE_URL}/tour/cart/?cart_ids=${idsParam}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        let errorMessage = "Failed to fetch cart items";
        if (errorData.non_field_errors && Array.isArray(errorData.non_field_errors)) {
            errorMessage = errorData.non_field_errors[0];
        } else {
            errorMessage = errorData.message || errorMessage;
        }
        throw new Error(errorMessage);
    }

    return response.json();
}

export async function getCartItem(id: number): Promise<CartItem> {
    const response = await fetch(`${API_BASE_URL}/tour/cart/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        let errorMessage = "Failed to fetch cart item";
        if (errorData.non_field_errors && Array.isArray(errorData.non_field_errors)) {
            errorMessage = errorData.non_field_errors[0];
        } else {
            errorMessage = errorData.message || errorMessage;
        }
        throw new Error(errorMessage);
    }

    return response.json();
}

export async function updateCartItem(id: number, payload: Partial<AddToCartPayload>): Promise<CartItem> {
    const response = await fetch(`${API_BASE_URL}/tour/cart/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        let errorMessage = "Failed to update cart item";
        if (errorData.non_field_errors && Array.isArray(errorData.non_field_errors)) {
            errorMessage = errorData.non_field_errors[0];
        } else {
            errorMessage = errorData.message || errorMessage;
        }
        throw new Error(errorMessage);
    }

    return response.json();
}

export async function deleteCartItem(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/tour/cart/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        let errorMessage = "Failed to delete cart item";
        if (errorData.non_field_errors && Array.isArray(errorData.non_field_errors)) {
            errorMessage = errorData.non_field_errors[0];
        } else {
            errorMessage = errorData.message || errorMessage;
        }
        throw new Error(errorMessage);
    }
}


export async function getRecommendedTours(id: number | string): Promise<TourPlanResponse> {
    const response = await fetch(`${API_BASE_URL}/tour/plan/recomended/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        let errorMessage = "Failed to fetch recommended tours";
        if (errorData.non_field_errors && Array.isArray(errorData.non_field_errors)) {
            errorMessage = errorData.non_field_errors[0];
        } else {
            errorMessage = errorData.message || errorMessage;
        }
        throw new Error(errorMessage);
    }

    return response.json();
}

export async function getBookingHistory(): Promise<any> {
    const token = typeof document !== 'undefined' ? document.cookie.split(';').find((item) => item.trim().startsWith('access_token='))?.split('=')[1] : null;
    if (!token) throw new Error("No access token found");

    const response = await fetch(`${API_BASE_URL}/tour/booking/`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        let errorMessage = "Failed to fetch booking history";
        if (errorData.non_field_errors && Array.isArray(errorData.non_field_errors)) {
            errorMessage = errorData.non_field_errors[0];
        } else {
            errorMessage = errorData.message || errorMessage;
        }
        throw new Error(errorMessage);
    }

    return response.json();
}

export interface TourNotice {
    id: number;
    title: string;
    description: string;
    is_active: boolean;
}

export interface TourNoticeResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: TourNotice[];
}

export interface ContactMessage {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
}

export async function getTourNotice(): Promise<TourNoticeResponse> {
    const response = await fetch(`${API_BASE_URL}/tour/notice/`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        let errorMessage = "Failed to fetch tour notice";
        if (errorData.non_field_errors && Array.isArray(errorData.non_field_errors)) {
            errorMessage = errorData.non_field_errors[0];
        } else {
            errorMessage = errorData.message || errorMessage;
        }
        throw new Error(errorMessage);
    }

    return response.json();
}

export async function sendContactMessage(payload: ContactMessage): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/tour/contacts/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        let errorMessage = "Failed to send contact message";
        if (errorData.non_field_errors && Array.isArray(errorData.non_field_errors)) {
            errorMessage = errorData.non_field_errors[0];
        } else {
            errorMessage = errorData.message || errorMessage;
        }
        throw new Error(errorMessage);
    }

    return response.json();
}
