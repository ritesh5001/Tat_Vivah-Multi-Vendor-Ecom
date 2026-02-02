
interface User {
    id: string;
    fullName: string;
    avatar: string | null;
}

export interface Review {
    id: string;
    rating: number;
    text: string;
    images: string[];
    createdAt: string;
    user: User;
}

export interface CreateReviewPayload {
    rating: number;
    text: string;
    images: string[];
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetchProductReviews(productId: string): Promise<Review[]> {
    if (!API_BASE_URL) return [];

    const response = await fetch(`${API_BASE_URL}/v1/reviews/product/${productId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        cache: "no-store", // Ensure fresh data
    });

    if (!response.ok) {
        return [];
    }

    const data = await response.json();
    return data.reviews || [];
}

export async function submitProductReview(
    productId: string,
    payload: CreateReviewPayload,
    token: string
): Promise<Review> {
    if (!API_BASE_URL) throw new Error("API URL not configured");

    const response = await fetch(`${API_BASE_URL}/v1/reviews/product/${productId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to submit review");
    }

    return data.review;
}
