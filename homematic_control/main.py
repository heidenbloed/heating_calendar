#! .venv/bin/python
import logging

import heating_schedular


def main():
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s - %(levelname)s - %(message)s",
    )
    schedular = heating_schedular.HeatingSchedular()
    schedular.run_endless()


if __name__ == "__main__":
    main()
