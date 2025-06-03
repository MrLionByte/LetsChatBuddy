import jwt
from django.conf import settings

def decode_jwt_token(token):
    try:
        return jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=["HS256"],
            )
    except jwt.ExpiredSignatureError:
        raise jwt.ExpiredSignatureError("Token has expired")
    except jwt.InvalidTokenError:
        raise jwt.InvalidTokenError("Invalid token")
    except Exception as e:
        raise Exception(f"An error occurred while decoding the token: {str(e)}")
    