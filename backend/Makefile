include .env
export

.PHONY: token user

token:
	@curl -s -X POST https://api.intra.42.fr/oauth/token \
		-H "Content-Type: application/json" \
		-d '{"grant_type":"client_credentials","client_id":"$(FT_CLIENT_UID)","client_secret":"$(FT_CLIENT_SECRET)"}' \
		| python3 -m json.tool

user:
	@TOKEN=$$(curl -s -X POST https://api.intra.42.fr/oauth/token \
		-H "Content-Type: application/json" \
		-d '{"grant_type":"client_credentials","client_id":"$(FT_CLIENT_UID)","client_secret":"$(FT_CLIENT_SECRET)"}' \
		| python3 -c "import sys,json; print(json.load(sys.stdin)['access_token'])"); \
	curl -s https://api.intra.42.fr/v2/users/$(LOGIN) \
		-H "Authorization: Bearer $$TOKEN" | python3 -m json.tool
