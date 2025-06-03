export const saveSuggestedFriends = (data) => {
    sessionStorage.setItem('suggestedFriends', JSON.stringify(data));
};

export const getSuggestedFriends = () => {
    const cached = JSON.parse(sessionStorage.getItem('suggestedFriends') || '[]');
    return cached.length > 0 ? cached : null;
};

export const clearSuggestedFriends = () => {
    sessionStorage.removeItem('suggestedFriends');
};