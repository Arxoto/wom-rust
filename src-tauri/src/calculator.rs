use num_traits::pow::Pow;
use rust_decimal::prelude::*;

peg::parser!(grammar arithmetic() for str {
    pub rule expression() -> Decimal
        = _ v:add_subtract() _ { v }
    #[cache_left_rec]
    rule add_subtract() -> Decimal
        = l:add_subtract() _ "+" _ r:multiply_divide() { l + r }
        / l:add_subtract() _ "-" _ r:multiply_divide() { l - r }
        / multiply_divide()
    #[cache_left_rec]
    rule multiply_divide() -> Decimal
        = l:multiply_divide() _ "*" _ r:power() { l * r }
        / l:multiply_divide() _ "/" _ r:power() { l / r }
        / l:multiply_divide() _ "%" _ r:power() { l % r }
        / power()
    #[cache_left_rec]
    rule power() -> Decimal
        = l:power() _ "^" _ r:sub_expression() { l.pow(r) }
        / sub_expression()
    rule sub_expression() -> Decimal
        = "(" _ v:add_subtract() _ ")" { v }
        / number()
    rule number() -> Decimal
        = n:$("-"? ['0'..='9']+ ("." ['0'..='9']+)?) { Decimal::from_str(n).unwrap() }
    rule _ = " "*
});

#[tauri::command]
pub fn calc(expr: String) -> Result<String, String> {
    let result_pack = std::panic::catch_unwind(|| {
        arithmetic::expression(&expr)
            .map(|value| value.to_string())
            .map_err(|_| "not_expression".to_string())
    });
    match result_pack {
        Ok(result) => result,
        Err(_) => Err("panic!".to_string()),
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_err() {
        let x: Result<i32, i32> = Ok(3);
        assert_eq!(x.map_err(|_| "err".to_string()), Ok(3));
        let x: Result<i32, i32> = Err(3);
        assert_eq!(x.map_err(|_| "err".to_string()), Err("err".to_string()));
    }

    #[test]
    fn test_decimal() {
        let nb1 = Decimal::from_str("0.1").unwrap();
        let nb2 = Decimal::from_str("0.2").unwrap();
        assert_eq!((nb1 + nb2).to_string(), "0.3");
        assert_ne!((0.1 + 0.2).to_string(), "0.3"); // 十进制转二进制的精度问题
    }

    #[test]
    fn test_number() {
        assert_eq!(
            arithmetic::expression(" -1.55 ").unwrap(),
            Decimal::from_str("-1.55").unwrap()
        );
        assert_eq!(
            arithmetic::expression("2.55 ").unwrap(),
            Decimal::from_str("2.55").unwrap()
        );
        // sub
        assert_eq!(
            arithmetic::expression("0 -(-1.0)").unwrap(),
            Decimal::from_str("1.0").unwrap()
        );

        // with err
        assert!(arithmetic::expression(" --1.0").is_err());
        // sub
        assert!(arithmetic::expression(" -(-1.0)").is_err());
    }

    #[test]
    fn test_add_subtract() {
        assert_eq!(
            arithmetic::expression("5-3+1").unwrap(),
            Decimal::from_str("3").unwrap()
        );
        assert_eq!(
            arithmetic::expression("5 + 3+11").unwrap(),
            Decimal::from_str("19").unwrap()
        );
        assert_eq!(
            arithmetic::expression("5 + -6 -3+11").unwrap(),
            Decimal::from_str("7").unwrap()
        );
        assert_eq!(
            arithmetic::expression("5-3-3+1-2+3-4-5+6+7").unwrap(),
            Decimal::from_str("5").unwrap()
        );
        // sub
        assert_eq!(
            arithmetic::expression("5-3-((3+1-2)+3-(4-5+7))+7").unwrap(),
            Decimal::from_str("10").unwrap()
        );
    }

    #[test]
    fn test_multiply_divide() {
        // println!("{}", 65.9%8.1);
        assert_eq!(
            arithmetic::expression("2*3").unwrap(),
            Decimal::from_str("6").unwrap()
        );
        assert_eq!(
            arithmetic::expression("2/2*3").unwrap(),
            Decimal::from_str("3").unwrap()
        );
        assert_eq!(
            arithmetic::expression("2%3").unwrap(),
            Decimal::from_str("2").unwrap()
        );
        assert_eq!(
            arithmetic::expression("3 % 2").unwrap(),
            Decimal::from_str("1").unwrap()
        );
        assert_eq!(
            arithmetic::expression("2*3/2").unwrap(),
            Decimal::from_str("3").unwrap()
        );
        assert_eq!(
            arithmetic::expression("3/2*2").unwrap(),
            Decimal::from_str("3.0").unwrap()
        );
        assert_eq!(
            arithmetic::expression("3/2 + 3/4 + 3/8 + 3/8").unwrap(),
            Decimal::from_str("3").unwrap()
        );
        assert_eq!(
            arithmetic::expression("3/2/3/5*2 + 1").unwrap(),
            Decimal::from_str("1.2").unwrap()
        );
        // sub
        assert_eq!(
            arithmetic::expression("3/(3/2)/(5*2 -2)").unwrap(),
            Decimal::from_str("0.25").unwrap()
        );
        assert_eq!(
            arithmetic::expression("3/(3/2)/(5%2 -2)").unwrap(),
            Decimal::from_str("-2").unwrap()
        );
    }

    #[test]
    fn test_power() {
        // println!("{}", 2.0f64.powf(2.0);
        assert_eq!(
            arithmetic::expression("2^3").unwrap(),
            Decimal::from_str("8").unwrap()
        );
        assert_eq!(
            arithmetic::expression("2^2+1").unwrap(),
            Decimal::from_str("5").unwrap()
        );
        assert_eq!(
            arithmetic::expression("2^2*3").unwrap(),
            Decimal::from_str("12").unwrap()
        );
        assert_eq!(
            arithmetic::expression("2*3^2 / 3 + 1").unwrap(),
            Decimal::from_str("7").unwrap()
        );
        // sub
        assert_eq!(
            arithmetic::expression("2*3^ (1 + 2^3%6)").unwrap(),
            Decimal::from_str("54").unwrap()
        );
    }
}
