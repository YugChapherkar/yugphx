// API client for communicating with Flask backend

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  const contentType = response.headers.get("content-type");
  const isJson = contentType && contentType.includes("application/json");
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    return {
      error: isJson && data.message ? data.message : "An error occurred",
    };
  }

  return { data: data as T };
}

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem("authToken");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function uploadVideo(
  file: File,
  onProgress?: (progress: number) => void,
): Promise<ApiResponse<any>> {
  const formData = new FormData();
  formData.append("video", file);

  try {
    // For demo purposes, simulate upload progress
    if (onProgress) {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 5;
        if (progress > 95) {
          clearInterval(interval);
        } else {
          onProgress(progress);
        }
      }, 200);
    }

    // In a real implementation, you would use fetch with the actual API endpoint
    // const response = await fetch(`${API_BASE_URL}/api/videos/upload`, {
    //   method: "POST",
    //   headers: {
    //     Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    //   },
    //   body: formData,
    // });
    // return handleResponse(response);

    // For demo, simulate a successful response after 3 seconds
    return new Promise((resolve) => {
      setTimeout(() => {
        if (onProgress) onProgress(100);
        resolve({
          data: {
            id: "video-" + Math.random().toString(36).substring(2, 9),
            name: file.name,
            size: file.size,
            url: URL.createObjectURL(file),
          },
        });
      }, 3000);
    });
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Upload failed" };
  }
}

export async function processVideo(
  videoId: string,
  settings: any,
  onProgress?: (progress: number) => void,
): Promise<ApiResponse<any>> {
  try {
    // For demo purposes, simulate processing progress
    if (onProgress) {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 5;
        if (progress > 95) {
          clearInterval(interval);
        } else {
          onProgress(progress);
        }
      }, 200);
    }

    // In a real implementation, you would use fetch with the actual API endpoint
    // const response = await fetch(`${API_BASE_URL}/api/videos/${videoId}/process`, {
    //   method: "POST",
    //   headers: getAuthHeaders(),
    //   body: JSON.stringify(settings),
    // });
    // return handleResponse(response);

    // For demo, simulate a successful response after 5 seconds
    return new Promise((resolve) => {
      setTimeout(() => {
        if (onProgress) onProgress(100);
        resolve({
          data: {
            id: videoId,
            processedUrl:
              "https://images.unsplash.com/photo-1626544827763-d516dce335e2?w=800&q=80",
            platform: settings.platform,
            aspectRatio: settings.aspectRatio,
            resolution: settings.resolution,
            processedAt: new Date().toISOString(),
          },
        });
      }, 5000);
    });
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Processing failed",
    };
  }
}

export async function getUserVideos(): Promise<ApiResponse<any[]>> {
  try {
    // In a real implementation, you would use fetch with the actual API endpoint
    // const response = await fetch(`${API_BASE_URL}/api/videos`, {
    //   headers: getAuthHeaders(),
    // });
    // return handleResponse(response);

    // For demo, return mock data
    return {
      data: [
        {
          id: "1",
          name: "Product Promo Video",
          platform: "YouTube",
          date: "2023-06-15",
          status: "completed",
          thumbnail:
            "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=300&q=80",
          duration: "2:45",
          size: "24.5 MB",
        },
        {
          id: "2",
          name: "Social Media Ad",
          platform: "Instagram",
          date: "2023-06-14",
          status: "completed",
          thumbnail:
            "https://images.unsplash.com/photo-1611162616305-c69b3396f6b4?w=300&q=80",
          duration: "0:30",
          size: "8.2 MB",
        },
        {
          id: "3",
          name: "Tutorial Video",
          platform: "TikTok",
          date: "2023-06-13",
          status: "processing",
          thumbnail:
            "https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=300&q=80",
          duration: "1:15",
          size: "15.7 MB",
        },
      ],
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to fetch videos",
    };
  }
}

export async function deleteVideo(videoId: string): Promise<ApiResponse<void>> {
  try {
    // In a real implementation, you would use fetch with the actual API endpoint
    // const response = await fetch(`${API_BASE_URL}/api/videos/${videoId}`, {
    //   method: "DELETE",
    //   headers: getAuthHeaders(),
    // });
    // return handleResponse(response);

    // For demo, simulate a successful response
    return { data: undefined };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to delete video",
    };
  }
}

export async function logout(): Promise<void> {
  try {
    // In a real implementation, you might want to invalidate the token on the server
    // await fetch(`${API_BASE_URL}/api/auth/logout`, {
    //   method: "POST",
    //   headers: getAuthHeaders(),
    // });

    // Clear local storage
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  } catch (error) {
    console.error("Logout error:", error);
  }
}
