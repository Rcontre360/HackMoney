import math

# Assume 1% chance that borrower defaults in a given month
MONTHLY_DEFAULT_PROB = 0.01


def get_poap_def_prob(wallet_address):
	# TODO: Fill in code to access data from "Credit Data Sources" thread. Placeholder for now.
	return 0.1


def get_term_def_prob(loan_term_in_months):
	return round(1 - (1 - MONTHLY_DEFAULT_PROB)**loan_term_in_months, 4)


def get_loan_amount_def_prob(loan_amount):
	return 0.25 * (1 - math.exp(-loan_amount / 50000))
