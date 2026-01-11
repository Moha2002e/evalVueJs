export class ApiClient {
    private static readonly BASE_URL = '/api';

    protected async get<T>(endpoint: string): Promise<T> {
        const response = await fetch(`${ApiClient.BASE_URL}${endpoint}`);
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        return response.json();
    }

    protected async post<T>(endpoint: string, body: any): Promise<T> {
        const response = await fetch(`${ApiClient.BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
        if (!response.ok) {
            let message = `Erreur HTTP: ${response.status}`;
            try {
                const errorBody = await response.text();
                // Essaie de parser si c'est du JSON, sinon garde le texte brut
                try {
                    const jsonError = JSON.parse(errorBody);
                    if (jsonError && jsonError.message) {
                        message = jsonError.message;
                    } else {
                        message = errorBody;
                    }
                } catch {
                    message = errorBody || message;
                }
            } catch (e) {
                // Ignore parsing error
            }
            throw new Error(message);
        }
        return response.json();
    }

    protected async put<T>(endpoint: string, body: any): Promise<T> {
        const response = await fetch(`${ApiClient.BASE_URL}${endpoint}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        return response.json();
    }

    protected async delete(endpoint: string): Promise<void> {
        const response = await fetch(`${ApiClient.BASE_URL}${endpoint}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
    }
}
